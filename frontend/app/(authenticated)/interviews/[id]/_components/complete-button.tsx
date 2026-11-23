"use client";

import { InterviewSession } from "@/app/api/interview-sessions";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useInterviews } from "@/hooks/use-interviews";
import { useRouter } from "next/navigation";

type CompleteInterviewButtonProps = {
  interview: InterviewSession;
};

export default function CompleteInterviewButton({
  interview,
}: CompleteInterviewButtonProps) {
  const { completeInterview, evaluateInterview } = useInterviews();

  const [isLoading, startTransition] = useTransition();

  const router = useRouter();

  function handleCompleteInterview() {
    startTransition(async () => {
      try {
        await completeInterview(interview.id);
      } catch {
        toast.add({
          type: "error",
          description: "Failed to complete the interview. Please try again.",
        });
        return;
      }

      try {
        await evaluateInterview(interview.id);
      } catch {
        toast.add({
          type: "error",
          description: "Interview completed, but the evaluation failed.",
        });
      }

      router.push(`/interviews/${interview.id}/evaluate`);
      router.refresh();
    });
  }

  if (interview.status === "completed") {
    return (
      <Button variant={"outline"} disabled={true}>
        <Check /> Completed
      </Button>
    );
  }

  return (
    <Button
      variant={"outline"}
      disabled={isLoading}
      onClick={handleCompleteInterview}
    >
      {isLoading ? <Spinner /> : <Check />}
      {isLoading ? "Evaluating..." : "Complete Interview"}
    </Button>
  );
}
