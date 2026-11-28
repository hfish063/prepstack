import type { InterviewQuestionRead } from "@/lib/api/generated"
import QuestionMenu from "./menu"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type QuestionViewProps = {
  phaseId: number
  activeQuestion: InterviewQuestionRead
  questions: InterviewQuestionRead[]
  actions?: React.ReactNode
  children: React.ReactNode
}

export default function QuestionView({
  phaseId,
  activeQuestion,
  questions,
  actions,
  children,
}: QuestionViewProps) {
  return (
    <div className="flex h-full min-h-0 flex-row gap-4">
      <div className="w-56 shrink-0 lg:w-72 xl:w-80 2xl:w-96">
        <QuestionMenu
          phaseId={phaseId}
          questions={questions}
          activeQuestionId={activeQuestion.id}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
            <CardDescription>{activeQuestion.text}</CardDescription>
            {actions && <CardAction>{actions}</CardAction>}
          </CardHeader>
        </Card>
        {children}
      </div>
    </div>
  )
}
