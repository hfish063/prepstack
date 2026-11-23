import { InterviewPhaseEvaluation } from "@/app/api/interview-evaluations";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ConversationEvaluationResultsProps = {
  evaluation?: InterviewPhaseEvaluation;
};

export default function ConversationEvaluationResults({
  evaluation,
}: ConversationEvaluationResultsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Phase Summary</CardTitle>
          <CardDescription>{evaluation?.summary}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
