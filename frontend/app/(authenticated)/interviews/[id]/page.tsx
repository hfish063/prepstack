import { auth } from "@clerk/nextjs/server";
import {
  findInterviewById,
  findPhasesForInterview,
} from "@/app/api/interview-sessions";
import { findMessagesForPhase } from "@/app/api/messages";
import ChatPanel from "@/components/interview-sessions/chat-panel";

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

  const behavioralPhase = phases.find(
    (phase) => phase.phaseType === "behavioral",
  );

  if (!behavioralPhase) {
    return (
      <p className="text-sm text-muted-foreground">
        This interview has no behavioral phase.
      </p>
    );
  }

  const messages = await findMessagesForPhase(token, behavioralPhase.id);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div>
        <h1 className="text-lg font-medium">{interview.role}</h1>
        <p className="text-sm text-muted-foreground">
          {interview.experienceLevel}
        </p>
      </div>
      <div className="min-h-0 flex-1">
        <ChatPanel
          phaseId={behavioralPhase.id}
          initialMessages={messages}
        />
      </div>
    </div>
  );
}
