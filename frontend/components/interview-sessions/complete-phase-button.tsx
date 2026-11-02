import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { InterviewPhase } from "@/app/api/interview-phases";

type CompletePhaseButtonProps = {
  phase: InterviewPhase | undefined;
};

export default function CompletePhaseButton({
  phase,
}: CompletePhaseButtonProps) {
  if (!phase) {
    return;
  }

  return (
    <Button variant={"outline"} disabled={phase.status === "completed"}>
      <Check /> Complete Phase
    </Button>
  );
}
