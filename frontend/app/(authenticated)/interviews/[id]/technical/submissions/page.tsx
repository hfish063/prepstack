import { findPhasesForInterview } from "@/app/api/interview-phases";
import SubmissionsPanel from "./panel";
import { getProblemSubmissions } from "@/app/api/code-execution";
import { getServerAuthToken } from "@/lib/auth";

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const interviewId = Number(id);

  const token = await getServerAuthToken();

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

  return (
    <SubmissionsPanel phaseId={currentPhase.id} submissions={submissions} />
  );
}
