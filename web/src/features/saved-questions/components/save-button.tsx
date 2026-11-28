import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import type { PhaseType } from "@/lib/api/generated"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { useSaveQuestion } from "../hooks/use-save-question"
import { getSavedQuestionsQueryOptions } from "../hooks/use-saved-questions"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SaveQuestionButtonProps = {
  questionId: number
  content: string
  phaseType: PhaseType
}

export default function SaveQuestionButton({
  questionId,
  content,
  phaseType,
}: SaveQuestionButtonProps) {
  const { data: isSaved } = useSuspenseQuery({
    ...getSavedQuestionsQueryOptions(),
    select: (savedQuestions) =>
      savedQuestions.some(
        (savedQuestion) => savedQuestion.sourceQuestionId === questionId
      ),
  })

  const saveQuestion = useSaveQuestion({
    mutationConfig: {
      onSuccess: () =>
        toast.add({ type: "success", description: "Question saved." }),
      onError: () =>
        toast.add({
          type: "error",
          description: "Failed to save the question. Please try again.",
        }),
    },
  })

  const isSaving = saveQuestion.isPending

  function handleSaveQuestion() {
    saveQuestion.mutate({
      body: { content, phaseType, sourceQuestionId: questionId },
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isSaved || isSaving}
            onClick={handleSaveQuestion}
          >
            {isSaving ? (
              <Spinner />
            ) : isSaved ? (
              <BookmarkCheck />
            ) : (
              <Bookmark />
            )}
          </Button>
        }
      />
      <TooltipContent>{!isSaved && "Save"}</TooltipContent>
    </Tooltip>
  )
}
