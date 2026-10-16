import apiFetch from "./api";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: number;
  phaseId: number;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export async function findMessagesForPhase(token: string, phaseId: number) {
  const response = await apiFetch(`/messages/${phaseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch messages for phase with id: ${phaseId}`);
  }

  return (await response.json()) as Message[];
}

export async function sendMessage(
  token: string,
  phaseId: number,
  content: string,
) {
  const response = await apiFetch(`/messages/send/${phaseId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message for phase with id: ${phaseId}`);
  }

  return (await response.json()) as Message;
}
