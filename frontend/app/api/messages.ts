import apiFetch from "./api";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: number;
  phaseId: number;
  questionId: number;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export async function findMessagesForQuestion(
  token: string,
  questionId: number,
) {
  const response = await apiFetch(`/questions/${questionId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch messages for question with id: ${questionId}`,
    );
  }

  return (await response.json()) as Message[];
}

export async function sendMessage(
  token: string,
  questionId: number,
  content: string,
) {
  const response = await apiFetch(`/questions/${questionId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to send message for question with id: ${questionId}`,
    );
  }

  return (await response.json()) as Message;
}
