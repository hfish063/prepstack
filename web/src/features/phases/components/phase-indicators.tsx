import { useState } from "react"
import { Circle, CircleCheck, CircleDot } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { InterviewPhaseRead } from "@/lib/api/generated"
import { useAdvancePhase } from "@/features/phases/hooks/use-advance-phase"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "@/components/ui/toast"

type InterviewPhaseIndicatorsProps = {
  phases: InterviewPhaseRead[]
}

export default function InterviewPhaseIndicators({
  phases,
}: InterviewPhaseIndicatorsProps) {
  const navigate = useNavigate()

  const advancePhase = useAdvancePhase()

  const [confirmTarget, setConfirmTarget] = useState<InterviewPhaseRead | null>(
    null
  )

  const currentPhase = phases.find((phase) => phase.status === "in_progress")

  const advancingToIndex = advancePhase.isPending
    ? advancePhase.variables.path.target_phase_index
    : null

  function handleSelectPhase(targetPhase: InterviewPhaseRead) {
    if (!currentPhase || targetPhase.id === currentPhase.id) {
      return
    }

    setConfirmTarget(targetPhase)
  }

  async function handleConfirmAdvance() {
    if (!currentPhase || !confirmTarget) {
      return
    }

    const targetPhase = confirmTarget
    setConfirmTarget(null)

    advancePhase.mutate(
      {
        path: {
          phase_id: currentPhase.id,
          target_phase_index: targetPhase.orderIndex,
        },
      },
      {
        onSuccess: () =>
          navigate({
            to: `/interviews/$interviewId/${targetPhase.phaseType}`,
            params: { interviewId: targetPhase.interviewId },
          }),
        onError: () =>
          toast.add({
            type: "error",
            description:
              "Failed to change the current phase. Please try again.",
          }),
      }
    )
  }

  return (
    <>
      <div className="flex flex-row flex-wrap items-center gap-2">
        {phases.map((phase) => (
          <div key={phase.id}>
            <Button
              variant={"ghost"}
              disabled={advancePhase.isPending}
              onClick={() => handleSelectPhase(phase)}
            >
              {phase.orderIndex === advancingToIndex ? (
                <Spinner />
              ) : (
                <InterviewPhaseIndicatorIcon phase={phase} />
              )}
              {phase.phaseType}
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change phase?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark {currentPhase?.phaseType} as complete and move you
              to {confirmTarget?.phaseType}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAdvance}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

type InterviewPhaseIndicatorIconProps = {
  phase: InterviewPhaseRead
}
function InterviewPhaseIndicatorIcon({
  phase,
}: InterviewPhaseIndicatorIconProps) {
  let icon = <Circle className="text-muted-foreground" />

  if (phase.status === "completed") {
    icon = <CircleCheck className="text-confirmation" />
  } else if (phase.status === "in_progress") {
    icon = <CircleDot className="text-pending" />
  }

  return icon
}
