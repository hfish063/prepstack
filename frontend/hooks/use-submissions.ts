"use client";

import { deleteAllProblemSubmissions } from "@/app/api/code-execution";
import { useAuthToken } from "./use-auth-token";

export function useSubmissions() {
  const resolveToken = useAuthToken();

  return {
    deleteSubmissions: async (phaseId: number) => {
      const token = await resolveToken();
      return deleteAllProblemSubmissions(token, phaseId);
    },
  };
}
