import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ManageInterviewButton from "./manage-button"
import { CircleCheck, CircleDot } from "lucide-react"
import type { InterviewSessionRead, InterviewStatus } from "@/lib/api/generated"
import { Link } from "@tanstack/react-router"
import { parseTopics } from "@/features/interviews/utils/utils"

type InterviewCardProps = {
  interview: InterviewSessionRead
}

export default function InterviewCard({ interview }: InterviewCardProps) {
  const topics = parseTopics(interview.topics)

  return (
    <Card className="relative transition-colors hover:bg-muted">
      <CardContent>
        <Item className="p-0">
          <ItemMedia variant="icon" className="relative z-10">
            <InterviewStatusIndicator status={interview.status} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <Link
                to="/interviews/$interviewId"
                params={{ interviewId: interview.id }}
                className="after:absolute after:inset-0"
              >
                {interview.role}
              </Link>
            </ItemTitle>
            <ItemDescription>
              {interview.experienceLevel} ·{" "}
              {new Date(interview.createdAt).toLocaleDateString("en-US")}
            </ItemDescription>
          </ItemContent>
          <ItemActions className="relative z-10">
            <ManageInterviewButton interview={interview} />
          </ItemActions>
          <ItemFooter className="h-5 justify-start overflow-hidden">
            {topics.map((topic) => (
              <Badge key={topic} variant="secondary">
                {topic}
              </Badge>
            ))}
          </ItemFooter>
        </Item>
      </CardContent>
    </Card>
  )
}

type InterviewStatusIndicatorProps = {
  status: InterviewStatus
}

function InterviewStatusIndicator({ status }: InterviewStatusIndicatorProps) {
  let icon = <CircleDot />

  if (status === "completed") {
    icon = <CircleCheck />
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex items-center">{icon}</span>}
      />
      <TooltipContent>{status}</TooltipContent>
    </Tooltip>
  )
}
