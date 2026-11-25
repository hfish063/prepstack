import { useInterviewSummary } from "../hooks/use-interview-summary"
import EvaluateInterviewButton from "./evaluate-button"
import PhaseEvaluationTabs from "./phase-evaluation-tabs"
import InterviewSummaryResults from "./summary-results"

type InterviewEvaluationProps = {
  interviewId: number
}

export default function InterviewEvaluation({
  interviewId,
}: InterviewEvaluationProps) {
  const { data: summary } = useInterviewSummary(interviewId)

  if (!summary) return <EvaluateInterviewButton interviewId={interviewId} />

  return (
    <div className="flex flex-col gap-4">
      <InterviewSummaryResults summary={summary} />
      <PhaseEvaluationTabs evaluations={summary.phaseEvaluations} />
    </div>
  )
}
