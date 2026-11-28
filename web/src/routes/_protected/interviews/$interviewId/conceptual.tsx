import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import EvaluationPrompt from "@/features/evaluations/components/evaluation-prompt"
import ChatPanel from "@/features/interview-sessions/components/chat-panel"
import { usePhases } from "@/features/phases/hooks/use-phases"
import { findCurrentPhase } from "@/features/phases/utils/utils"
import QuestionView from "@/features/questions/components/view"
import { useQuestions } from "@/features/questions/hooks/use-questions"
import {
  loadPhaseQuestions,
  questionSearchSchema,
} from "@/features/questions/utils/load-phase-questions"
import SaveQuestionButton from "@/features/saved-questions/components/save-button"
import { getSavedQuestionsQueryOptions } from "@/features/saved-questions/hooks/use-saved-questions"
import type { InterviewPhaseRead } from "@/lib/api/generated"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

const PAGE_PHASE = "conceptual"

export const Route = createFileRoute(
  "/_protected/interviews/$interviewId/conceptual"
)({
  validateSearch: questionSearchSchema,
  loader: ({ context, params }) =>
    Promise.all([
      loadPhaseQuestions({
        queryClient: context.queryClient,
        interviewId: params.interviewId,
        phaseType: PAGE_PHASE,
      }),
      context.queryClient.query(getSavedQuestionsQueryOptions()),
    ]),
  component: ConceptualPhasePage,
})

function ConceptualPhasePage() {
  const { interviewId } = Route.useParams()
  const { data: phases } = usePhases(interviewId)

  const currentPhase = findCurrentPhase(phases)
  const pagePhase = phases.find((phase) => phase.phaseType === PAGE_PHASE)

  if (!currentPhase || !pagePhase) {
    return <EvaluationPrompt interviewId={interviewId} />
  }

  return <ConceptualQuestions phase={pagePhase} />
}

type ConceptualQuestionsProps = {
  phase: InterviewPhaseRead
}

function ConceptualQuestions({ phase }: ConceptualQuestionsProps) {
  const { question } = Route.useSearch()
  const { data: questions } = useQuestions(phase.id)

  const activeQuestion =
    questions.find((currentQuestion) => currentQuestion.id == question) ??
    questions[0]

  if (!activeQuestion) {
    return (
      <p className="text-sm text-muted-foreground">
        No questions are available for this phase yet.
      </p>
    )
  }

  return (
    <QuestionView
      phaseId={phase.id}
      activeQuestion={activeQuestion}
      questions={questions}
      actions={
        <SaveQuestionButton
          questionId={activeQuestion.id}
          content={activeQuestion.text}
          phaseType={phase.phaseType}
        />
      }
    >
      <Suspense
        fallback={
          <Card className="flex flex-1 items-center justify-center">
            <Spinner />
          </Card>
        }
      >
        <ChatPanel questionId={activeQuestion.id} />
      </Suspense>
    </QuestionView>
  )
}
