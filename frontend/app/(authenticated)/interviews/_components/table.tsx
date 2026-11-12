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
import { Button } from "@/components/ui/button";
import { SquareArrowRightEnter } from "lucide-react";
import Link from "next/link";

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
                <div className="flex gap-2">
                  <Button variant={"ghost"} size={"icon"}>
                    <Link href={`/interviews/${interview.id}`}>
                      <SquareArrowRightEnter />
                    </Link>
                  </Button>
                  <ManageInterviewButton interview={interview} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
