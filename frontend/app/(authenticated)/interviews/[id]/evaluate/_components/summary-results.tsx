import { InterviewSummary } from "@/app/api/interview-evaluations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

type InterviewSummaryProps = {
  summary: InterviewSummary;
};

export default function InterviewSummaryResults({
  summary,
}: InterviewSummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Overall Evaluation Score</CardTitle>
        </CardHeader>
        <CardContent>{`${summary.overallScore} / 100`}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Phase Evaluation Competencies</CardTitle>
          <CardDescription>
            Response quality across every interview phase
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <Progress value={summary.phaseEvaluations[0].score}>
            <ProgressLabel>Behavioral</ProgressLabel>
            <ProgressValue />
          </Progress>
          <Progress value={summary.phaseEvaluations[1].score}>
            <ProgressLabel>Conceptual</ProgressLabel>
            <ProgressValue />
          </Progress>
          <Progress value={summary.phaseEvaluations[2].score}>
            <ProgressLabel>Technical</ProgressLabel>
            <ProgressValue />
          </Progress>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex gap-2">
            <Sparkles />
            Interview Summary
          </CardTitle>
          <CardDescription>{summary.summary}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
