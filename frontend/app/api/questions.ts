import apiFetch from "./api";

export interface InterviewQuestion {
  id: number;
  phaseId: number;
  text: string;
  ordinal: number;
}

export async function findQuestionsForPhase(token: string, phaseId: number) {
  const response = await apiFetch(`/questions/${phaseId}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch questions for phase with id: ${phaseId}`);
  }

  return (await response.json()) as InterviewQuestion[];
}
