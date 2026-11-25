import InterviewEvaluation from "@/features/evaluations/components/interview-evaluation"
import { getInterviewSummaryOptions } from "@/features/evaluations/hooks/use-interview-summary"
import { getInterviewQueryOptions } from "@/features/interviews/hooks/use-interview"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_protected/interviews/$interviewId/evaluate"
)({
  loader: async ({ context, params }) => {
    const { interviewId } = params

    const interview = await context.queryClient.query(
      getInterviewQueryOptions(interviewId)
    )

    if (interview.status === "in_progress") {
      throw redirect({ to: "/interviews/$interviewId", params })
    }

    await context.queryClient.query(getInterviewSummaryOptions(interviewId))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { interviewId } = Route.useParams()
  return <InterviewEvaluation interviewId={interviewId} />
}
