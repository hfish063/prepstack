import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import type { InterviewSummaryRead } from "@/lib/api/generated"
import {
  ChartColumn,
  CheckCircle,
  CircleExclamationPoint,
  Sparkles,
} from "lucide-react"
import { InterviewScoreChart } from "./interview-score-chart"
import { findEvaluationByPhaseType } from "../utils/utils"

type InterviewSummaryProps = {
  summary: InterviewSummaryRead
}

export default function InterviewSummaryResults({
  summary,
}: InterviewSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <OverallScoreCard summary={summary} />
      <PhaseCompetenciesCard summary={summary} />
      <InterviewSummaryCard summary={summary} />
      <KeyStrengthsCard summary={summary} />
      <AreasToImproveCard summary={summary} />
      <InterviewSummaryStatsCard summary={summary} />
    </div>
  )
}

function OverallScoreCard({ summary }: InterviewSummaryProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Overall Evaluation Score</CardTitle>
      </CardHeader>
      <CardContent>
        <InterviewScoreChart score={summary.overallScore} />
      </CardContent>
    </Card>
  )
}

function PhaseCompetenciesCard({ summary }: InterviewSummaryProps) {
  const behavioralEvaluation = findEvaluationByPhaseType(
    summary.phaseEvaluations,
    "behavioral"
  )
  const conceptualEvaluation = findEvaluationByPhaseType(
    summary.phaseEvaluations,
    "conceptual"
  )
  const technicalEvaluation = findEvaluationByPhaseType(
    summary.phaseEvaluations,
    "technical"
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phase Evaluation Competencies</CardTitle>
        <CardDescription>
          Response quality across every interview phase
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Progress value={behavioralEvaluation?.score ?? 0}>
          <ProgressLabel>Behavioral</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Progress value={conceptualEvaluation?.score ?? 0}>
          <ProgressLabel>Conceptual</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Progress value={technicalEvaluation?.score ?? 0}>
          <ProgressLabel>Technical</ProgressLabel>
          <ProgressValue />
        </Progress>
      </CardContent>
    </Card>
  )
}

function InterviewSummaryCard({ summary }: InterviewSummaryProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Sparkles />
          Interview Summary
        </CardTitle>
        <CardDescription>{summary.summary}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function KeyStrengthsCard({ summary }: InterviewSummaryProps) {
  const strengths = summary.feedback.filter((item) => item.type === "strength")

  if (strengths.length == 0) {
    return
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <CheckCircle className="text-confirmation" />
          Key Strengths
        </CardTitle>
        <CardDescription>
          <ul className="list-disc pl-3">
            {strengths.map((strength, index) => (
              <li key={index} className="marker:text-confirmation">
                {strength.content}
              </li>
            ))}
          </ul>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function AreasToImproveCard({ summary }: InterviewSummaryProps) {
  const improvements = summary.feedback.filter(
    (item) => item.type === "improvement"
  )

  if (improvements.length == 0) {
    return
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <CircleExclamationPoint className="text-pending" />
          Areas to Improve
        </CardTitle>
        <CardDescription>
          <ul className="list-disc pl-3">
            {improvements.map((improvement, index) => (
              <li key={index} className="marker:text-pending">
                {improvement.content}
              </li>
            ))}
          </ul>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function InterviewSummaryStatsCard({ summary }: InterviewSummaryProps) {
  const summaryStats = summary.stats

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <ChartColumn />
          Interview Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <StatTile
          label="Questions Answered"
          value={`${summaryStats.answeredQuestions} / ${summaryStats.totalQuestions}`}
        />
        <StatTile label="Messages Sent" value={summaryStats.messageCount} />
        <StatTile label="Hints Used" value={summaryStats.hintsUsed} />
      </CardContent>
    </Card>
  )
}

type StatTileProps = {
  label: string
  value: string | number
}

function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border p-3 text-center">
      <p className="text-xl font-semibold md:text-lg xl:text-2xl">{value}</p>
      <p className="line-clamp-2 min-h-[2lh] text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
