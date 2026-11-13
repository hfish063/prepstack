"ues client";

import {
  deleteNotesForInterview,
  InterviewSessionNotesCreate,
  InterviewSessionNotesUpdate,
  saveNotesForInterview,
  updateNotesForInterview,
} from "@/app/api/interview-session-notes";
import { useAuthToken } from "./use-auth-token";

export function useNotes() {
  const resolveToken = useAuthToken();

  return {
    deleteNotes: async (interviewId: number) => {
      const token = await resolveToken();
      await deleteNotesForInterview(token, interviewId);
    },
    saveNotes: async (
      interviewId: number,
      notesCreate: InterviewSessionNotesCreate,
    ) => {
      const token = await resolveToken();
      return await saveNotesForInterview(token, interviewId, notesCreate);
    },
    updateNotes: async (
      interviewId: number,
      notesUpdate: InterviewSessionNotesUpdate,
    ) => {
      const token = await resolveToken();
      return await updateNotesForInterview(token, interviewId, notesUpdate);
    },
  };
}
