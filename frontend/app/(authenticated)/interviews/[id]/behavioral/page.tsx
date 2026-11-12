import { findPhasesForInterview, PhaseType } from "@/app/api/interview-phases";
import { findMessagesForPhase } from "@/app/api/messages";
import ChatPanel from "@/components/interviews/chat-panel";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const PAGE_PHASE: PhaseType = "behavioral";

export default async function BehavioralPhasePage({
  params,
}: {
  params: Promise<{ id: string; phaseType: string }>;
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

  if (currentPhase.phaseType !== PAGE_PHASE) {
    redirect(`/interviews/${interviewId}/${currentPhase.phaseType}`);
  }

  const messages = await findMessagesForPhase(token, currentPhase.id);

  return <ChatPanel phaseId={currentPhase.id} initialMessages={messages} />;
}
