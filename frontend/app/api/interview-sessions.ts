import apiFetch from "./api";

export type InterviewStatus = "in_progress" | "completed" | "abandoned";

export interface InterviewSession {
  id: number;
  role: string;
  experienceLevel: string;
  topics: string;
  description: string;
  userId: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewSessionCreate {
  role: string;
  experienceLevel: string;
  topics?: string;
  description?: string;
}

export async function findAllInterviewsForUser(token: string) {
  const response = await apiFetch(`/interviews/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch interview sessions.");
  }

  return (await response.json()) as InterviewSession[];
}

export async function saveInterview(
  token: string,
  newInterviewSession: InterviewSessionCreate,
) {
  const response = await apiFetch("/interviews/save", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newInterviewSession),
  });

  if (!response.ok) {
    throw new Error("Failed to save interview session.");
  }

  return (await response.json()) as InterviewSession;
}

export async function findInterviewById(token: string, interviewId: number) {
  const response = await apiFetch(`/interviews/${interviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch interview session with id: ${interviewId}`,
    );
  }

  return (await response.json()) as InterviewSession;
}

export async function markInterviewComplete(
  token: string,
  interviewId: number,
) {
  const response = await apiFetch(`/interviews/${interviewId}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to complete interview with id: ${interviewId}`);
  }

  return (await response.json()) as InterviewSession;
}

export async function deleteInterviewByIdForUser(
  token: string,
  interviewId: number,
) {
  const response = await apiFetch(`/interviews/delete/${interviewId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete interview session with id: ${interviewId}`,
    );
  }
}
