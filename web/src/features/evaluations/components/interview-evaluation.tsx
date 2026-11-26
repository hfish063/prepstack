import { Link } from "@tanstack/react-router"
import { useInterviewSummary } from "../hooks/use-interview-summary"
import EvaluateInterviewButton from "./evaluate-button"
import PhaseEvaluationTabs from "./phase-evaluation-tabs"
import InterviewSummaryResults from "./summary-results"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { ArrowLeft } from "lucide-react"
import EvaluateReportButton from "./download-report-button"

type InterviewEvaluationProps = {
  interviewId: number
}

export default function InterviewEvaluation({
  interviewId,
}: InterviewEvaluationProps) {
  const { data: summary } = useInterviewSummary(interviewId)

  if (!summary) return <EvaluateInterviewButton interviewId={interviewId} />

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <Link
          to="/interviews"
          className={cn(buttonVariants({ variant: "link" }), "w-min px-0")}
        >
          <ArrowLeft />
          All Interviews
        </Link>
        <EvaluateReportButton summary={summary} />
      </div>
      <InterviewSummaryResults summary={summary} />
      <PhaseEvaluationTabs evaluations={summary.phaseEvaluations} />
    </div>
  )
}
