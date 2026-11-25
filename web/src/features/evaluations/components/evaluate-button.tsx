import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { Sparkles } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useEvaluateInterview } from "../hooks/use-evaluate-interview"

type EvaluateInterviewButtonProps = {
  interviewId: number
}

export default function EvaluateInterviewButton({
  interviewId,
}: EvaluateInterviewButtonProps) {
  const navigate = useNavigate()

  const evaluateInterview = useEvaluateInterview({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description: "Failed to evaluate the interview. Please try again.",
        }),
    },
  })

  const isEvaluating = evaluateInterview.isPending

  function handleEvaluateInterview() {
    evaluateInterview.mutate(
      { path: { interview_id: interviewId } },
      {
        onSuccess: () =>
          navigate({
            to: "/interviews/$interviewId/evaluate",
            params: { interviewId },
          }),
      }
    )
  }

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">
        This interview has not been evaluated yet.
      </p>
      <Button disabled={isEvaluating} onClick={handleEvaluateInterview}>
        {isEvaluating ? <Spinner /> : <Sparkles />}
        {isEvaluating ? "Evaluating..." : "Evaluate Interview"}
      </Button>
    </div>
  )
}
