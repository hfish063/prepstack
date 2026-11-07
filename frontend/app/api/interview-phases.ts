import apiFetch from "./api";

export type PhaseType = "behavioral" | "conceptual" | "technical";
export type PhaseStatus = "pending" | "in_progress" | "completed";

export interface InterviewPhase {
  id: number;
  interviewId: number;
  phaseType: PhaseType;
  orderIndex: number;
  status: PhaseStatus;
  startedAt: string | null;
  completedAt: string | null;
}

export async function findPhasesForInterview(
  token: string,
  interviewId: number,
) {
  const response = await apiFetch(`/interviews/${interviewId}/phases`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch phases for interview with id: ${interviewId}`,
    );
  }

  return (await response.json()) as InterviewPhase[];
}

export async function advancePhase(
  token: string,
  phaseId: number,
  targetPhaseIndex: number,
) {
  const response = await apiFetch(
    `/phases/${phaseId}/advance/${targetPhaseIndex}`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    throw new Error("Failed to advance current interview phase");
  }

  return (await response.json()) as InterviewPhase;
}
