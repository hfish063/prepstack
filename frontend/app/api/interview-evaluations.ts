import apiFetch from "./api";
import { ProblemSubmissionHistoryRead } from "./code-execution";
import { PhaseType } from "./interview-phases";

export interface CodingEvaluation {
  timeComplexity: string;
  spaceComplexity: string;
  complexityReasoning: string;
  submission: ProblemSubmissionHistoryRead;
}

export interface InterviewPhaseEvaluation {
  score: number;
  summary: string;
  phaseType: PhaseType;
  codingEvaluation: CodingEvaluation | null;
}

export interface InterviewSummary {
  overallScore: number;
  summary: string;
  phaseEvaluations: InterviewPhaseEvaluation[];
}

export async function findInterviewSummary(token: string, interviewId: number) {
  const response = await apiFetch(`/interviews/${interviewId}/evaluate`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch summary for interview with id: ${interviewId}`,
    );
  }

  return (await response.json()) as InterviewSummary;
}

export async function evaluateInterview(token: string, interviewId: number) {
  const response = await apiFetch(`/interviews/${interviewId}/evaluate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to evaluate interview with id: ${interviewId}`);
  }

  return (await response.json()) as InterviewSummary;
}
