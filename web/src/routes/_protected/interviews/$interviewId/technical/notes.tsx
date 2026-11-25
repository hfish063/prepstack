import NotesPanel from "@/features/notes/components/panel"
import { getNotesQueryOptions } from "@/features/notes/hooks/use-notes"
import { usePhases } from "@/features/phases/hooks/use-phases"
import { findPhaseByType } from "@/features/phases/utils/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_protected/interviews/$interviewId/technical/notes"
)({
  loader: ({ context, params }) =>
    context.queryClient.query(getNotesQueryOptions(params.interviewId)),
  component: RouteComponent,
})

function RouteComponent() {
  const { interviewId } = Route.useParams()
  const { data: phases } = usePhases(interviewId)

  const technicalPhase = findPhaseByType(phases, "technical")

  if (!technicalPhase) return

  return <NotesPanel interviewId={interviewId} />
}
