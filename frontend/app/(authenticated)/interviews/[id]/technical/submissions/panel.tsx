"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProblemSubmissionHistoryRead } from "@/app/api/code-execution";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useSubmissions } from "@/hooks/use-submissions";

type SubmissionPanelProps = {
  phaseId: number;
  submissions: ProblemSubmissionHistoryRead[];
};

export default function SubmissionsPanel({
  phaseId,
  submissions,
}: SubmissionPanelProps) {
  const router = useRouter();

  const { deleteSubmissions } = useSubmissions();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteSubmissions(phaseId);
      router.refresh();
    } catch {
      console.error("Failed to clear submissions history");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full p-6">
      <div className="flex w-full justify-end">
        <Button
          variant={"destructive"}
          className="w-28"
          disabled={isDeleting || submissions.length == 0}
          onClick={handleDelete}
        >
          {isDeleting ? <Spinner /> : "Clear History"}
        </Button>
      </div>
      <Separator />
      {submissions.length != 0 && (
        <Card className="p-0 w-full">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission</TableHead>
                  <TableHead>Language</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {submission.accepted ? (
                          <p className="text-confirmation font-semibold">
                            Accepted
                          </p>
                        ) : (
                          <p className="text-destructive font-semibold">
                            Failed
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.createdAt).toLocaleDateString(
                            "en-US",
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{submission.language.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
