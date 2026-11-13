"use client";

import { InterviewSession } from "@/app/api/interview-sessions";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useInterviews } from "@/hooks/use-interviews";
import { useRouter } from "next/navigation";

type CompleteInterviewButtonProps = {
  interview: InterviewSession;
};

export default function CompleteInterviewButton({
  interview,
}: CompleteInterviewButtonProps) {
  const { completeInterview } = useInterviews();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleCompleteInterview() {
    setIsLoading(true);
    try {
      await completeInterview(interview.id);
      router.refresh();
    } catch {
      console.error(`Error completing interview with id: ${interview.id}`);
    } finally {
      setIsLoading(false);
    }
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
      {isLoading ? <Spinner /> : <Check />} Complete Interview
    </Button>
  );
}
