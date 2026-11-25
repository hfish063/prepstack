import {
  getPhasesQueryOptions,
  usePhases,
} from "@/features/phases/hooks/use-phases"
import { findPhaseByType } from "@/features/phases/utils/utils"
import SubmissionsPanel from "@/features/submissions/components/panel"
import { getSubmissionsQueryOptions } from "@/features/submissions/hooks/use-submissions"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_protected/interviews/$interviewId/technical/submissions"
)({
  loader: async ({ context, params }) => {
    const phases = await context.queryClient.query(
      getPhasesQueryOptions(params.interviewId)
    )
    const technicalPhase = findPhaseByType(phases, "technical")

    if (technicalPhase) {
      await context.queryClient.query(
        getSubmissionsQueryOptions(technicalPhase.id)
      )
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { interviewId } = Route.useParams()
  const { data: phases } = usePhases(interviewId)

  const technicalPhase = findPhaseByType(phases, "technical")

  if (!technicalPhase) return

  return <SubmissionsPanel phaseId={technicalPhase.id} />
}
