import { findPhasesForInterview, PhaseType } from "@/app/api/interview-phases";
import { findMessagesForQuestion } from "@/app/api/messages";
import { findQuestionsForPhase } from "@/app/api/questions";
import ChatPanel from "@/components/interviews/chat-panel";
import { getServerAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuestionMenu from "../_components/question-menu";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PAGE_PHASE: PhaseType = "conceptual";

export default async function ConceptualPhasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; phaseType: string }>;
  searchParams: Promise<{ question?: string }>;
}) {
  const { id } = await params;
  const interviewId = Number(id);

  const { question } = await searchParams;
  const questionId = Number(question);

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

  if (currentPhase.phaseType !== PAGE_PHASE) {
    redirect(`/interviews/${interviewId}/${currentPhase.phaseType}`);
  }

  const questions = await findQuestionsForPhase(token, currentPhase.id);

  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No questions are available for this phase yet.
      </p>
    );
  }

  const activeQuestion = questions.find(
    (question) => question.id == questionId,
  );

  if (!activeQuestion) {
    redirect(
      `/interviews/${interviewId}/${PAGE_PHASE}?question=${questions[0].id}`,
    );
  }

  const messages = await findMessagesForQuestion(token, activeQuestion.id);

  return (
    <div className="flex flex-row h-full min-h-0 gap-4">
      <div className="w-56 shrink-0 lg:w-72 xl:w-80 2xl:w-96">
        <QuestionMenu
          questions={questions}
          activeQuestionId={activeQuestion.id}
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
            <CardDescription>{activeQuestion.text}</CardDescription>
          </CardHeader>
        </Card>
        <ChatPanel
          key={activeQuestion.id}
          phaseId={currentPhase.id}
          questionId={activeQuestion.id}
          initialMessages={messages}
        />
      </div>
    </div>
  );
}
