"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAuth } from "@clerk/nextjs";
import {
  deleteAllProblemSubmissions,
  getProblemSubmissions,
  ProblemSubmissionHistoryRead,
} from "@/app/api/code-execution";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";

type SubmissionPanelProps = {
  phaseId: number;
};

export default function SubmissionsPanel({ phaseId }: SubmissionPanelProps) {
  const { getToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [submissions, setSubmissions] = useState<
    ProblemSubmissionHistoryRead[]
  >([]);

  useEffect(() => {
    const loadSubmissions = async () => {
      const token = await getToken();
      if (!token) return;

      setIsLoading(true);

      try {
        const submissions = await getProblemSubmissions(token, phaseId);
        setSubmissions(submissions);
      } catch {
        console.error("Failed to retrieve submissions history");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmissions();
  }, [phaseId, getToken]);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const token = await getToken();
      if (!token) return;

      await deleteAllProblemSubmissions(token, phaseId);

      setSubmissions([]);
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
                    <TableCell>{submission.languageId}</TableCell>
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
