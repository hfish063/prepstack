"use client";

import {
  markInterviewComplete,
  deleteInterviewByIdForUser,
} from "@/app/api/interview-sessions";
import { evaluateInterview } from "@/app/api/interview-evaluations";
import { useAuthToken } from "./use-auth-token";

export function useInterviews() {
  const resolveToken = useAuthToken();

  return {
    deleteInterview: async (interviewId: number) => {
      const token = await resolveToken();
      return await deleteInterviewByIdForUser(token, interviewId);
    },
    completeInterview: async (interviewId: number) => {
      const token = await resolveToken();
      return await markInterviewComplete(token, interviewId);
    },
    evaluateInterview: async (interviewId: number) => {
      const token = await resolveToken();
      return await evaluateInterview(token, interviewId);
    },
  };
}
