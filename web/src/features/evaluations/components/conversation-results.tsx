import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { usePhaseMessages } from "@/features/messages/hooks/use-phase-messages"
import type {
  HttpValidationError,
  InterviewPhaseEvaluationRead,
  MessageRead,
} from "@/lib/api/generated"
import type { UseQueryResult } from "@tanstack/react-query"
import { Bot, MessageSquareText, TriangleAlert, UserCircle } from "lucide-react"

type ConversationEvaluationResultsProps = {
  evaluation?: InterviewPhaseEvaluationRead
}

export default function ConversationEvaluationResults({
  evaluation,
}: ConversationEvaluationResultsProps) {
  if (!evaluation) {
    return
  }

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <PhaseSummaryCard evaluation={evaluation} />
      <PhaseTranscriptCard evaluation={evaluation} />
    </div>
  )
}

type PhaseEvaluationCardProps = {
  evaluation: InterviewPhaseEvaluationRead
}

function PhaseSummaryCard({ evaluation }: PhaseEvaluationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phase Summary</CardTitle>
        <CardDescription>{evaluation?.summary}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function PhaseTranscriptCard({ evaluation }: PhaseEvaluationCardProps) {
  const messagesQuery = usePhaseMessages(evaluation.phaseId)
  const messages = messagesQuery.data

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="flex flex-row gap-2">
          <MessageSquareText />
          Transcript
        </CardTitle>
        {messages && <Badge>{messages.length}</Badge>}
      </CardHeader>
      <Separator />
      <CardContent className="min-h-96">
        <TranscriptContent query={messagesQuery} />
      </CardContent>
    </Card>
  )
}

type TranscriptContentProps = {
  query: UseQueryResult<MessageRead[], HttpValidationError>
}

function TranscriptContent({ query }: TranscriptContentProps) {
  if (query.isPending) {
    return (
      <div className="flex size-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (query.isError) {
    return (
      <TranscriptError
        isRetrying={query.isFetching}
        onRetry={() => query.refetch()}
      />
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <ItemGroup>
        {query.data?.map((message) => (
          <Item key={message.id} variant={"outline"}>
            <ItemMedia>
              {message.role === "user" ? <UserCircle /> : <Bot />}
            </ItemMedia>
            <ItemContent>
              <ItemDescription>
                {new Date(message.createdAt).toLocaleDateString()} •{" "}
                {new Date(message.createdAt).toLocaleTimeString()}
              </ItemDescription>
              {message.content}
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </ScrollArea>
  )
}

type TranscriptErrorProps = {
  isRetrying: boolean
  onRetry: () => void
}

function TranscriptError({ isRetrying, onRetry }: TranscriptErrorProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <TriangleAlert />
        </EmptyMedia>
        <EmptyTitle>Couldn't Load Transcript</EmptyTitle>
        <EmptyDescription>
          Something went wrong loading this transcript.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant={"outline"} disabled={isRetrying} onClick={onRetry}>
          {isRetrying ? <Spinner /> : "Try Again"}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
