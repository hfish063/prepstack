"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Circle, CircleCheck, CircleDot } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { InterviewPhase, advancePhase } from "@/app/api/interview-phases";

type InterviewPhaseIndicatorsProps = {
  phases: InterviewPhase[];
};

export default function InterviewPhaseIndicators({
  phases,
}: InterviewPhaseIndicatorsProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [advancingTo, setAdvancingTo] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<InterviewPhase | null>(
    null,
  );

  const currentPhase = phases.find((phase) => phase.status === "in_progress");

  function handleSelectPhase(targetPhase: InterviewPhase) {
    if (!currentPhase || targetPhase.id === currentPhase.id) {
      return;
    }

    setConfirmTarget(targetPhase);
  }

  async function handleConfirmAdvance() {
    if (!currentPhase || !confirmTarget) {
      return;
    }

    const targetPhase = confirmTarget;
    setConfirmTarget(null);
    setAdvancingTo(targetPhase.id);

    try {
      const token = await getToken();
      if (!token) throw new Error("Unauthenticated");

      await advancePhase(token, currentPhase.id, targetPhase.orderIndex);
      router.refresh();
    } catch {
      console.error(`Failed to advance to phase with id: ${targetPhase.id}`);
    } finally {
      setAdvancingTo(null);
    }
  }

  return (
    <>
      <div className="flex flex-row flex-wrap gap-2 items-center">
        {phases.map((phase) => (
          <div key={phase.id}>
            <Button
              variant={"ghost"}
              disabled={advancingTo !== null}
              onClick={() => handleSelectPhase(phase)}
            >
              {phase.id === advancingTo ? (
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
          if (!open) setConfirmTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Advance phase?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark {currentPhase?.phaseType} as complete and move
              you to {confirmTarget?.phaseType}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAdvance}>
              Advance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

type InterviewPhaseIndicatorIconProps = {
  phase: InterviewPhase;
};
function InterviewPhaseIndicatorIcon({
  phase,
}: InterviewPhaseIndicatorIconProps) {
  let icon = <Circle />;

  if (phase.status === "completed") {
    icon = <CircleCheck />;
  } else if (phase.status === "in_progress") {
    icon = <CircleDot />;
  }

  return icon;
}
