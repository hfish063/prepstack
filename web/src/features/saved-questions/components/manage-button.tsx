import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SavedQuestionRead } from "@/lib/api/generated"
import { EllipsisVertical, Trash } from "lucide-react"
import { useDeleteSavedQuestion } from "../hooks/use-delete-saved-question"
import { toast } from "@/components/ui/toast"

type ManageSavedQuestionButtonProps = {
  savedQuestion: SavedQuestionRead
}

export default function ManageSavedQuestionButton({
  savedQuestion,
}: ManageSavedQuestionButtonProps) {
  const deleteSavedQuestion = useDeleteSavedQuestion({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description: "Failed to delete the question. Please try again.",
        }),
    },
  })

  const isDeleting = deleteSavedQuestion.isPending

  const handleDelete = () => {
    deleteSavedQuestion.mutate({
      path: { saved_question_id: savedQuestion.id },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant={"outline"} size={"icon"}>
            <EllipsisVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant={"destructive"}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
