import apiFetch from "./api";

export interface InterviewSessionNotes {
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewSessionNotesCreate {
  text: string;
}

export interface InterviewSessionNotesUpdate {
  text: string;
}

export async function findNotesForInterview(
  token: string,
  interviewId: number,
) {
  const response = await apiFetch(`/interviews/${interviewId}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch notes for interview with id: ${interviewId}`,
    );
  }

  return (await response.json()) as InterviewSessionNotes;
}

export async function saveNotesForInterview(
  token: string,
  interviewId: number,
  notes: InterviewSessionNotesCreate,
) {
  const response = await apiFetch(`/interviews/${interviewId}/notes/save`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notes),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to save notes for interview with id: ${interviewId}`,
    );
  }

  return (await response.json()) as InterviewSessionNotes;
}

export async function updateNotesForInterview(
  token: string,
  interviewId: number,
  notes: InterviewSessionNotesUpdate,
) {
  const response = await apiFetch(`/interviews/${interviewId}/notes/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notes),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update notes for interview with id: ${interviewId}`,
    );
  }

  return (await response.json()) as InterviewSessionNotes;
}

export async function deleteNotesForInterview(
  token: string,
  interviewId: number,
) {
  const response = await apiFetch(`/interviews/${interviewId}/notes/delete`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete notes for interview with id: ${interviewId}`,
    );
  }
}
