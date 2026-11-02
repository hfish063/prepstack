"use client";

import {
  completeInterview,
  InterviewSession,
} from "@/app/api/interview-sessions";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

type CompleteInterviewButtonProps = {
  interview: InterviewSession;
};

export default function CompleteInterviewButton({
  interview,
}: CompleteInterviewButtonProps) {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleCompleteInterview() {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");

      await completeInterview(token, interview.id);
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
