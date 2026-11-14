import { getServerAuthToken } from "@/lib/auth";
import NotesPanel from "./panel";
import { findNotesForInterview } from "@/app/api/interview-session-notes";
import { notFound } from "next/navigation";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const interviewId = Number(id);

  if (!interviewId) {
    return notFound();
  }

  const token = await getServerAuthToken();

  const interviewNotes = await findNotesForInterview(token, interviewId);

  return <NotesPanel interviewId={interviewId} notes={interviewNotes} />;
}
