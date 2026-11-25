import ProblemPanel from "@/features/coding-problems/components/problem-panel"
import { usePhases } from "@/features/phases/hooks/use-phases"
import { findPhaseByType } from "@/features/phases/utils/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_protected/interviews/$interviewId/technical/question"
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { interviewId } = Route.useParams()
  const { data: phases } = usePhases(interviewId)

  const technicalPhase = findPhaseByType(phases, "technical")

  if (!technicalPhase) return

  return <ProblemPanel phaseId={technicalPhase.id} />
}
