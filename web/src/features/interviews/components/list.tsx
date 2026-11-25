import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { InterviewSessionRead, InterviewStatus } from "@/lib/api/generated"
import ManageInterviewButton from "./manage-button"
import { Link } from "@tanstack/react-router"
import { buttonVariants } from "@/components/ui/button"
import { Rocket } from "lucide-react"
import { cn } from "cn"
import { parseTopics } from "@/features/interviews/utils/utils"

const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  in_progress: "In Progress",
  completed: "Completed",
}

type InterviewListProps = {
  interviews: InterviewSessionRead[]
}

export default function InterviewList({ interviews }: InterviewListProps) {
  return (
    <div className="flex flex-col gap-4">
      {interviews.map((interview) => (
        <InterviewListItem key={interview.id} interview={interview} />
      ))}
    </div>
  )
}

type InterviewListItemProps = {
  interview: InterviewSessionRead
}

function InterviewListItem({ interview }: InterviewListItemProps) {
  const topics = parseTopics(interview.topics)

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="truncate text-lg font-semibold">{interview.role}</div>
          <StartedAt createdAt={interview.createdAt} />
          <Badge>{interview.experienceLevel}</Badge>
        </div>
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 md:justify-center">
            {topics.map((topic) => (
              <Badge key={topic} variant={"outline"}>
                {topic}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-row items-center gap-2">
          <Status interviewStatus={interview.status} />
          <InterviewAction interview={interview} />
          <ManageInterviewButton interview={interview} />
        </div>
      </CardContent>
    </Card>
  )
}

type StartedAtProps = {
  createdAt: string
}

function StartedAt({ createdAt }: StartedAtProps) {
  const date = new Date(createdAt)

  return (
    <time dateTime={createdAt} className="text-sm text-muted-foreground">
      Started {date.toLocaleDateString()} •{" "}
      {date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
    </time>
  )
}

type StatusProps = {
  interviewStatus: InterviewStatus
}

function Status({ interviewStatus }: StatusProps) {
  return (
    <Badge
      className="mr-auto md:mr-2"
      variant={interviewStatus === "completed" ? "success" : "secondary"}
    >
      {INTERVIEW_STATUS_LABELS[interviewStatus]}
    </Badge>
  )
}

type InterviewActionProps = {
  interview: InterviewSessionRead
}

function InterviewAction({ interview }: InterviewActionProps) {
  const className = cn(buttonVariants({ variant: "outline" }), "w-28")

  if (interview.status === "completed") {
    return (
      <Link
        to="/interviews/$interviewId/evaluate"
        params={{ interviewId: interview.id }}
        className={className}
      >
        View Results
      </Link>
    )
  }

  return (
    <Link
      to="/interviews/$interviewId"
      params={{ interviewId: interview.id }}
      className={className}
    >
      <Rocket /> Launch
    </Link>
  )
}
