"use client";

import { InterviewSession } from "@/app/api/interview-sessions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ManageInterviewButton from "./manage-button";
import { Card } from "@/components/ui/card";

type InterviewTableProps = {
  interviews: InterviewSession[];
};

export default function InterviewTable({ interviews }: InterviewTableProps) {
  return (
    <Card className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Experience Level</TableHead>
            <TableHead>Topics</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id}>
              <TableCell className="flex flex-col gap-2">
                <p>{interview.role}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(interview.createdAt).toLocaleDateString("en-us")}
                </p>
              </TableCell>
              <TableCell>{interview.experienceLevel}</TableCell>
              <TableCell>{interview.topics ?? ""}</TableCell>
              <TableCell>
                <ManageInterviewButton interview={interview} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
