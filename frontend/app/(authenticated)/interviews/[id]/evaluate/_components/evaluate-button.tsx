"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useInterviews } from "@/hooks/use-interviews";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type EvaluateInterviewButtonProps = {
  interviewId: number;
};

export default function EvaluateInterviewButton({
  interviewId,
}: EvaluateInterviewButtonProps) {
  const { evaluateInterview } = useInterviews();

  const [isLoading, startTransition] = useTransition();

  const router = useRouter();

  function handleEvaluateInterview() {
    startTransition(async () => {
      try {
        await evaluateInterview(interviewId);
        router.refresh();
      } catch {
        toast.add({
          type: "error",
          description: "Failed to evaluate the interview. Please try again.",
        });
      }
    });
  }

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">
        This interview has not been evaluated yet.
      </p>
      <Button disabled={isLoading} onClick={handleEvaluateInterview}>
        {isLoading ? <Spinner /> : <Sparkles />}
        {isLoading ? "Evaluating..." : "Evaluate Interview"}
      </Button>
    </div>
  );
}
