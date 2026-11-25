import { Link } from "@tanstack/react-router"
import { Sparkles } from "lucide-react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useInterviewSummary } from "../hooks/use-interview-summary"
import EvaluateInterviewButton from "./evaluate-button"

type EvaluationPromptProps = {
  interviewId: number
}

export default function EvaluationPrompt({
  interviewId,
}: EvaluationPromptProps) {
  return (
    <Suspense
      fallback={
        <div className="flex size-full items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <EvaluationPromptContent interviewId={interviewId} />
    </Suspense>
  )
}

function EvaluationPromptContent({ interviewId }: EvaluationPromptProps) {
  const { data: summary } = useInterviewSummary(interviewId)

  if (!summary) return <EvaluateInterviewButton interviewId={interviewId} />

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">
        This interview has been evaluated.
      </p>
      <Button
        nativeButton={false}
        render={
          <Link
            to="/interviews/$interviewId/evaluate"
            params={{ interviewId }}
          />
        }
      >
        <Sparkles />
        View Evaluation
      </Button>
    </div>
  )
}
