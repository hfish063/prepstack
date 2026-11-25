import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { getCodingProblemQueryOptions } from "@/features/coding-problems/hooks/use-coding-problem"
import { getLanguageTemplateQueryOptions } from "@/features/coding-problems/hooks/use-language-template"
import { getPreferredLanguage } from "@/features/coding-problems/utils/utils"
import EditorPanel from "@/features/coding-problems/components/editor-panel"
import {
  getPhasesQueryOptions,
  usePhases,
} from "@/features/phases/hooks/use-phases"
import {
  findCurrentPhase,
  findPhaseByType,
} from "@/features/phases/utils/utils"
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import TechnicalPhaseNavBar from "../../../../../components/layout/technical-nav-bar"
import { Separator } from "@/components/ui/separator"
import EvaluationPrompt from "@/features/evaluations/components/evaluation-prompt"

export const Route = createFileRoute(
  "/_protected/interviews/$interviewId/technical"
)({
  loader: async ({ context, params }) => {
    const phases = await context.queryClient.query(
      getPhasesQueryOptions(params.interviewId)
    )
    const currentPhase = findCurrentPhase(phases)

    if (!currentPhase) return

    if (currentPhase.phaseType !== "technical") {
      throw redirect({
        to: `/interviews/$interviewId/${currentPhase.phaseType}`,
        params: { interviewId: params.interviewId },
      })
    }

    const codingProblem = await context.queryClient.query(
      getCodingProblemQueryOptions(currentPhase.id)
    )
    const preferredLanguage = getPreferredLanguage(codingProblem.languages)

    await context.queryClient.query(
      getLanguageTemplateQueryOptions(currentPhase.id, preferredLanguage.id)
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { interviewId } = Route.useParams()
  const { data: phases } = usePhases(interviewId)

  const currentPhase = findCurrentPhase(phases)
  const technicalPhase = findPhaseByType(phases, "technical")

  const navigate = useNavigate()

  if (!currentPhase || !technicalPhase) {
    return <EvaluationPrompt interviewId={interviewId} />
  }

  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize={"50%"}>
        <div className="h-full p-4">
          <Card className="h-full gap-0 p-0">
            <CardHeader className="px-6 py-2">
              <TechnicalPhaseNavBar interviewId={interviewId} />
            </CardHeader>
            <Separator />
            <CardContent className="h-full min-h-0 flex-1 p-0">
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={"50%"}>
        <div className="h-full p-4">
          <EditorPanel
            phaseId={technicalPhase.id}
            onSubmitted={() =>
              navigate({
                to: "/interviews/$interviewId/technical/submissions",
                params: { interviewId },
              })
            }
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
