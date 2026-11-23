import { findInterviewSummary } from "@/app/api/interview-evaluations";
import { findInterviewById } from "@/app/api/interview-sessions";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerAuthToken } from "@/lib/auth";
import { findEvaluationByPhaseType } from "./_utils/utils";
import TechnicalEvaluationResults from "./_components/technical-results";
import ConversationEvaluationResults from "./_components/conversation-results";
import InterviewSummaryResults from "./_components/summary-results";
import EvaluateInterviewButton from "./_components/evaluate-button";

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const interviewId = Number(id);

  const token = await getServerAuthToken();

  const interview = await findInterviewById(token, interviewId);

  if (interview.status === "in_progress") {
    redirect(`/interviews/${interviewId}/behavioral`);
  }

  const summary = await findInterviewSummary(token, interviewId);

  if (!summary) {
    return <EvaluateInterviewButton interviewId={interviewId} />;
  }

  const phaseEvaluations = summary.phaseEvaluations;

  const behavioralEvaluation = findEvaluationByPhaseType(
    phaseEvaluations,
    "behavioral",
  );
  const conceptualEvaluation = findEvaluationByPhaseType(
    phaseEvaluations,
    "conceptual",
  );
  const technicalEvaluation = findEvaluationByPhaseType(
    phaseEvaluations,
    "technical",
  );

  return (
    <div className="flex flex-col gap-4">
      <InterviewSummaryResults summary={summary} />
      <Tabs>
        <TabsList className="mb-2">
          <TabsTrigger value={"behavioral"}>Behavioral</TabsTrigger>
          <TabsTrigger value={"conceptual"}>Conceptual</TabsTrigger>
          <TabsTrigger value={"technical"}>Technical</TabsTrigger>
        </TabsList>
        <TabsContent value={"behavioral"}>
          <ConversationEvaluationResults evaluation={behavioralEvaluation} />
        </TabsContent>
        <TabsContent value={"conceptual"}>
          <ConversationEvaluationResults evaluation={conceptualEvaluation} />
        </TabsContent>
        <TabsContent value={"technical"}>
          <TechnicalEvaluationResults
            technicalEvaluation={technicalEvaluation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
