"use client";

import { InterviewSession } from "@/app/api/interview-sessions";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import ManageInterviewButton from "./manage-interview-button";

type InterviewCardProps = {
  interview: InterviewSession;
};

export default function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <Card key={interview.id} className="relative">
      <CardHeader className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href={`/interviews/${interview.id}`}
            className="after:absolute after:inset-0"
          >
            <CardTitle>{interview.role}</CardTitle>
          </Link>
          <CardDescription>{interview.topics}</CardDescription>
        </div>
        <div className="relative z-10">
          <ManageInterviewButton interview={interview} />
        </div>
      </CardHeader>
    </Card>
  );
}
