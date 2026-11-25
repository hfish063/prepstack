import EvaluationPrompt from "@/features/evaluations/components/evaluation-prompt"
import { getPhasesQueryOptions } from "@/features/phases/hooks/use-phases"
import { findCurrentPhase } from "@/features/phases/utils/utils"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/interviews/$interviewId/")({
  loader: async ({ context, params }) => {
    const phases = await context.queryClient.query(
      getPhasesQueryOptions(params.interviewId)
    )

    const currentPhase = findCurrentPhase(phases)

    if (currentPhase) {
      throw redirect({
        to: `/interviews/$interviewId/${currentPhase.phaseType}`,
        params,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { interviewId } = Route.useParams()

  return <EvaluationPrompt interviewId={interviewId} />
}
