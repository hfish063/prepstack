import { Button, buttonVariants } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useAnalyzeQuestion } from "../hooks/use-analyze-saved-question"
import { Spinner } from "@/components/ui/spinner"
import { Link, useNavigate } from "@tanstack/react-router"
import { toast } from "@/components/ui/toast"
import { cn } from "cn"

type AnalyzeSavedQuestionButtonProps = {
  savedQuestionId: number
  isAnalyzed: boolean
}

export default function AnalyzeSavedQuestionButton({
  savedQuestionId,
  isAnalyzed,
}: AnalyzeSavedQuestionButtonProps) {
  const analyzeSavedQuestion = useAnalyzeQuestion({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description: "Error analyzing the question. Please try again.",
        }),
    },
  })

  const isLoading = analyzeSavedQuestion.isPending

  const navigate = useNavigate()

  const handleAnalyze = () => {
    analyzeSavedQuestion.mutate(
      {
        path: { saved_question_id: savedQuestionId },
      },
      {
        onSuccess: () =>
          navigate({
            to: "/question-bank/$questionId/analyze",
            params: { questionId: String(savedQuestionId) },
          }),
      }
    )
  }

  if (isAnalyzed) {
    return (
      <Link
        to="/question-bank/$questionId/analyze"
        params={{ questionId: String(savedQuestionId) }}
        className={cn(buttonVariants({ variant: "outline" }), "w-28")}
      >
        View Results
      </Link>
    )
  }

  return (
    <Button
      variant={"outline"}
      disabled={isAnalyzed || isLoading}
      onClick={handleAnalyze}
      className="w-28"
    >
      {isLoading ? <Spinner /> : <Sparkles />}
      {isLoading ? "Analyzing" : "Analyze"}
    </Button>
  )
}
