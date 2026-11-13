"use client";

import {
  runCodeAgainstExamples,
  RunCodeRequest,
  submitCandidateCode,
} from "@/app/api/code-execution";
import { useAuthToken } from "./use-auth-token";

export function useCode() {
  const resolveToken = useAuthToken();

  return {
    runCode: async (phaseId: number, request: RunCodeRequest) => {
      const token = await resolveToken();
      return await runCodeAgainstExamples(token, phaseId, request);
    },
    submitCode: async (phaseId: number, request: RunCodeRequest) => {
      const token = await resolveToken();
      return await submitCandidateCode(token, phaseId, request);
    },
  };
}
