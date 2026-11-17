import { requestHint, sendMessage } from "@/app/api/messages";
import { useAuthToken } from "./use-auth-token";

export function useMessages() {
  const resolveToken = useAuthToken();

  return {
    sendMessage: async (questionId: number, content: string) => {
      const token = await resolveToken();
      return await sendMessage(token, questionId, content);
    },
    requestHint: async (questionId: number) => {
      const token = await resolveToken();
      return await requestHint(token, questionId);
    },
  };
}
