import { findPhasesForInterview } from "@/app/api/interview-phases";
import SubmissionsPanel from "./panel";
import { auth } from "@clerk/nextjs/server";
import { getProblemSubmissions } from "@/app/api/code-execution";

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const interviewId = Number(id);

  const { getToken } = await auth();
  const token = await getToken();
  if (!token) return;

  const phases = await findPhasesForInterview(token, interviewId);
  const currentPhase = phases.find((phase) => phase.status === "in_progress");

  if (!currentPhase) {
    return (
      <p className="text-sm text-muted-foreground">
        This interview has already been completed and is set to read-only mode.
      </p>
    );
  }

  const submissions = await getProblemSubmissions(token, currentPhase.id);

  return <SubmissionsPanel submissions={submissions} />;
}
