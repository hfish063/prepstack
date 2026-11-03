import { auth } from "@clerk/nextjs/server";
import { findInterviewById } from "@/app/api/interview-sessions";
import { findPhasesForInterview } from "@/app/api/interview-phases";
import { findMessagesForPhase } from "@/app/api/messages";
import ChatPanel from "@/components/interview-sessions/chat-panel";
import InterviewPhaseIndicators from "@/components/interview-sessions/interview-phase-indicators";
import { Separator } from "@/components/ui/separator";
import CompleteInterviewButton from "@/components/interview-sessions/complete-interview-button";
import ManageInterviewSessionButton from "@/components/interview-sessions/manage-interview-session-button";

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth.protect();

  const { id } = await params;
  const interviewId = Number(id);

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return;
  }

  const [interview, phases] = await Promise.all([
    findInterviewById(token, interviewId),
    findPhasesForInterview(token, interviewId),
  ]);

  const currentPhase = phases.find((phase) => phase.status === "in_progress");

  if (!currentPhase) {
    return (
      <p>
        This interview has already been completed and is set to READONLY mode.
      </p>
    );
  }

  const messages = await findMessagesForPhase(token, currentPhase.id);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-row gap-2 items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">{interview.role}</h1>
          <p className="text-sm text-muted-foreground">
            {interview.experienceLevel}
          </p>
        </div>
        <ManageInterviewSessionButton interview={interview} />
      </div>

      <Separator />

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <InterviewPhaseIndicators phases={phases} />
        <CompleteInterviewButton interview={interview} />
      </div>
      <div className="min-h-0 flex-1">
        <ChatPanel
          key={currentPhase.id}
          phaseId={currentPhase.id}
          initialMessages={messages}
        />
      </div>
    </div>
  );
}
