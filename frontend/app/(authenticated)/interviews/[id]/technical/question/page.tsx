import { findCodingProblemForPhase } from "@/app/api/coding-problems";
import { findPhasesForInterview } from "@/app/api/interview-phases";
import QuestionPanel from "./panel";
import { getServerAuthToken } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function QuestionPage({
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

  const phases = await findPhasesForInterview(token, interviewId);
  const currentPhase = phases.find((phase) => phase.status === "in_progress");

  if (!currentPhase) {
    return (
      <p className="text-sm text-muted-foreground">
        This interview has already been completed and is set to read-only mode.
      </p>
    );
  }

  const problem = await findCodingProblemForPhase(token, currentPhase.id);

  return <QuestionPanel codingProblem={problem} />;
}
