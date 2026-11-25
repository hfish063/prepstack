import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import type { InterviewSessionRead } from "@/lib/api/generated"
import { useCompleteInterview } from "../hooks/use-complete-interview"

type CompleteInterviewButtonProps = {
  interview: InterviewSessionRead
}

export default function CompleteInterviewButton({
  interview,
}: CompleteInterviewButtonProps) {
  const completeInterview = useCompleteInterview({
    mutationConfig: {
      onError: () =>
        toast.add({
          type: "error",
          description: "Failed to complete the interview. Please try again.",
        }),
    },
  })

  const isCompleting = completeInterview.isPending

  function handleCompleteInterview() {
    completeInterview.mutate({ path: { interview_id: interview.id } })
  }

  if (interview.status === "completed") {
    return (
      <Button variant={"outline"} disabled={true}>
        <Check /> Completed
      </Button>
    )
  }

  return (
    <Button
      variant={"outline"}
      disabled={isCompleting}
      onClick={handleCompleteInterview}
    >
      {isCompleting ? <Spinner /> : <Check />}
      Complete Interview
    </Button>
  )
}
