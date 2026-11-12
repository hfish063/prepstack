"use client";

import {
  InterviewSession,
  InterviewStatus,
} from "@/app/api/interview-sessions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import Link from "next/link";
import ManageInterviewButton from "./manage-button";
import { CircleCheck, CircleDot, CircleX } from "lucide-react";

type InterviewCardProps = {
  interview: InterviewSession;
};

export default function InterviewCard({ interview }: InterviewCardProps) {
  const topics = interview.topics
    ? interview.topics
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean)
    : [];

  return (
    <Card key={interview.id} className="relative h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <div className="relative z-10">
            <InterviewStatusIndicator status={interview.status} />
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href={`/interviews/${interview.id}`}
              className="after:absolute after:inset-0"
            >
              <CardTitle>{interview.role}</CardTitle>
            </Link>
            <p className="text-sm text-muted-foreground">
              {interview.experienceLevel}
            </p>
          </div>
        </div>
        <div className="relative z-10">
          <ManageInterviewButton interview={interview} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-row flex-wrap gap-2">
        {topics.map((topic, index) => (
          <Badge key={index} variant="secondary">
            {topic}
          </Badge>
        ))}
      </CardContent>

      <CardFooter className="flex flex-row items-center">
        <span className="text-sm text-muted-foreground">
          {new Date(interview.createdAt).toLocaleDateString("en-US")}
        </span>
      </CardFooter>
    </Card>
  );
}
type InterviewStatusIndicatorProps = {
  status: InterviewStatus;
};

function InterviewStatusIndicator({ status }: InterviewStatusIndicatorProps) {
  let icon = <CircleDot />;

  if (status === "completed") {
    icon = <CircleCheck />;
  } else if (status === "abandoned") {
    icon = <CircleX />;
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex items-center">{icon}</span>}
      />
      <TooltipContent>{status}</TooltipContent>
    </Tooltip>
  );
}
