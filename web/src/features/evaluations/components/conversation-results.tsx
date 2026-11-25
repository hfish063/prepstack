import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { InterviewPhaseEvaluationRead } from "@/lib/api/generated"

type ConversationEvaluationResultsProps = {
  evaluation?: InterviewPhaseEvaluationRead
}

export default function ConversationEvaluationResults({
  evaluation,
}: ConversationEvaluationResultsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Phase Summary</CardTitle>
          <CardDescription>{evaluation?.summary}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
