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
  getProblemSubmissions,
  ProblemSubmissionHistoryRead,
} from "@/app/api/code-execution";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";

type SubmissionPanelProps = {
  phaseId: number;
};

export default function SubmissionsPanel({ phaseId }: SubmissionPanelProps) {
  const { getToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="flex h-full p-6">
      <Card className="p-0 w-full">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Code</TableHead>
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
                        <p className="text-destructive font-semibold">Failed</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.createdAt).toLocaleDateString(
                          "en-US",
                        )}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{submission.languageId}</TableCell>
                  <TableCell>
                    <Button variant={"link"}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}
