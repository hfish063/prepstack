import { Separator } from "@/components/ui/separator"
import CompleteInterviewButton from "@/features/interview-sessions/components/complete-button"
import ManageInterviewSessionButton from "@/features/interview-sessions/components/manage-session-button"
import InterviewPhaseIndicators from "@/features/phases/components/phase-indicators"
import {
  getInterviewQueryOptions,
  useInterview,
} from "@/features/interviews/hooks/use-interview"
import {
  getPhasesQueryOptions,
  usePhases,
} from "@/features/phases/hooks/use-phases"
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/interviews/$interviewId")({
  params: {
    parse: ({ interviewId }) => {
      const id = Number(interviewId)
      if (!Number.isInteger(id) || id < 0) throw notFound()
      return { interviewId: id }
    },
    stringify: ({ interviewId }) => ({ interviewId: String(interviewId) }),
  },
  loader: ({ context, params }) => {
    const { interviewId } = params

    return Promise.all([
      context.queryClient.query(getInterviewQueryOptions(interviewId)),
      context.queryClient.query(getPhasesQueryOptions(interviewId)),
    ])
  },
  component: InterviewSessionLayout,
})

function InterviewSessionLayout() {
  const { interviewId } = Route.useParams()
  const { data: interview } = useInterview(interviewId)
  const { data: phases } = usePhases(interviewId)

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-row justify-between gap-2">
        <div>
          <h1 className="text-lg font-medium">{interview.role}</h1>
          <p className="text-sm text-muted-foreground">
            {interview.experienceLevel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <InterviewPhaseIndicators phases={phases} />
          </div>
          <div className="flex flex-row gap-2">
            <CompleteInterviewButton interview={interview} />
            <ManageInterviewSessionButton interview={interview} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
