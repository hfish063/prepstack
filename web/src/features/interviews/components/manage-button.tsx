import type { InterviewSessionRead } from "@/lib/api/generated"
import { EllipsisVertical, Trash } from "lucide-react"
import { useDeleteInterview } from "../hooks/use-delete-interview"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"

type ManageInterviewButtonProps = {
  interview: InterviewSessionRead
}

export default function ManageInterviewButton({
  interview,
}: ManageInterviewButtonProps) {
  const deleteInterview = useDeleteInterview({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description: "Failed to delete the interview. Please try again.",
        }),
    },
  })

  const isDeleting = deleteInterview.isPending

  function handleDelete() {
    deleteInterview.mutate({ path: { interview_id: interview.id } })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant={"ghost"} size={"icon"} disabled={isDeleting}>
            <EllipsisVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash />
          {isDeleting ? <Spinner /> : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
