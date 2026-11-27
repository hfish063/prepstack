import { Button } from "@/components/ui/button"
import { EllipsisVertical, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { useDeleteInterview } from "@/features/interviews/hooks/use-delete-interview"
import { toast } from "@/components/ui/toast"
import type { InterviewSessionRead } from "@/lib/api/generated"
import { useNavigate } from "@tanstack/react-router"

type ManageInterviewSessionButtonProps = {
  interview: InterviewSessionRead
}

export default function ManageInterviewSessionButton({
  interview,
}: ManageInterviewSessionButtonProps) {
  const navigate = useNavigate()

  const deleteInterview = useDeleteInterview({
    mutationConfig: {
      onSuccess: () => {
        navigate({ to: "/interviews" })
      },
      onError: () =>
        toast.add({
          type: "error",
          description: "Failed to delete the interview. Please try again.",
        }),
    },
  })

  const isDeleting = deleteInterview.isPending

  const [confirmOpen, setConfirmOpen] = useState(false)

  async function handleDelete() {
    setConfirmOpen(false)

    deleteInterview.mutate({ path: { interview_id: interview.id } })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant={"ghost"} size={"icon"}>
              <EllipsisVertical />
            </Button>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
          >
            <Trash />
            {isDeleting ? <Spinner /> : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete interview session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this interview session, along with
              all of its phases and messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
