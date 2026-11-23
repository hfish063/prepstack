import { redirect } from "next/navigation";
import { findPhasesForInterview } from "@/app/api/interview-phases";
import { getServerAuthToken } from "@/lib/auth";

export default async function InterviewSessionPage({
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
    return redirect(`/interviews/${interviewId}/evaluate`);
  }

  redirect(`/interviews/${interviewId}/${currentPhase.phaseType}`);
}
