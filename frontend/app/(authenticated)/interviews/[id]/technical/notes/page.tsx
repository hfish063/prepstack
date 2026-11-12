import NotesPanel from "./panel";
import { auth } from "@clerk/nextjs/server";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const interviewId = Number(id);

  const { getToken } = await auth();
  const token = await getToken();
  if (!token) return;

  return <NotesPanel interviewId={interviewId} />;
}
