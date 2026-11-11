import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { findPhasesForInterview } from "@/app/api/interview-phases";
import { findMessagesForPhase } from "@/app/api/messages";
import {
  findCodingProblemForPhase,
  findLanguageTemplateForPhase,
} from "@/app/api/coding-problems";
import ChatPanel from "@/components/interview-sessions/chat-panel";
import CodingProblemWrapper from "@/components/interview-sessions/coding-problem-wrapper";

const PREFERRED_LANGUAGE_NAME = "Python";

export default async function InterviewPhasePage({
  params,
}: {
  params: Promise<{ id: string; phaseType: string }>;
}) {
  const { id, phaseType } = await params;
  const interviewId = Number(id);

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return null;
  }

  const phases = await findPhasesForInterview(token, interviewId);
  const currentPhase = phases.find((phase) => phase.status === "in_progress");

  if (!currentPhase) {
    return (
      <p className="text-sm text-muted-foreground">
        This interview has already been completed and is set to read-only mode.
      </p>
    );
  }

  // The URL is a hint, not the source of truth - if it's stale (phase
  // advanced since this link was shared, bookmarked, or hand-edited),
  // correct it rather than rendering content that disagrees with it.
  if (phaseType !== currentPhase.phaseType) {
    redirect(`/interviews/${interviewId}/${currentPhase.phaseType}`);
  }

  if (currentPhase.phaseType !== "technical") {
    const messages = await findMessagesForPhase(token, currentPhase.id);

    return (
      <ChatPanel
        key={currentPhase.id}
        phaseId={currentPhase.id}
        initialMessages={messages}
      />
    );
  }

  const codingProblem = await findCodingProblemForPhase(token, currentPhase.id);
  const preferredLanguage =
    codingProblem.languages.find(
      (language) => language.name === PREFERRED_LANGUAGE_NAME,
    ) ?? codingProblem.languages[0];
  const languageTemplate = await findLanguageTemplateForPhase(
    token,
    currentPhase.id,
    preferredLanguage.id,
  );

  return (
    <CodingProblemWrapper
      key={currentPhase.id}
      interviewId={interviewId}
      phaseId={currentPhase.id}
      codingProblem={codingProblem}
      languageTemplate={languageTemplate}
      preferredLanguage={preferredLanguage}
    />
  );
}
