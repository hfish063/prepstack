"use client";

import { advancePhase } from "@/app/api/interview-phases";
import { useAuthToken } from "./use-auth-token";

export function usePhases() {
  const resolveToken = useAuthToken();

  return {
    advancePhase: async (currentPhaseId: number, targetPhaseIndex: number) => {
      const token = await resolveToken();
      return await advancePhase(token, currentPhaseId, targetPhaseIndex);
    },
  };
}
