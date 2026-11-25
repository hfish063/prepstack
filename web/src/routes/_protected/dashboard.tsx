import { buttonVariants } from "@/components/ui/button"
import RecentInterviewsList from "@/features/dashboard/components/recent-interviews-list"
import StatGrid from "@/features/dashboard/components/stat-grid"
import Welcome from "@/features/dashboard/components/welcome"
import {
  getDashboardQueryOptions,
  useDashboard,
} from "@/features/dashboard/hooks/use-dashboard"
import CreateInterviewDialog from "@/features/interviews/components/create-dialog"
import {
  getInterviewsQueryOptions,
  useInterviews,
} from "@/features/interviews/hooks/use-interviews"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Play } from "lucide-react"

const RECENT_INTERVIEWS_LIMIT = 5

export const Route = createFileRoute("/_protected/dashboard")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.query(getDashboardQueryOptions()),
      context.queryClient.query(
        getInterviewsQueryOptions({ limit: RECENT_INTERVIEWS_LIMIT })
      ),
      context.queryClient.query(
        getInterviewsQueryOptions({ status: "in_progress", limit: 1 })
      ),
    ]),
  component: DashboardPage,
})

function DashboardPage() {
  const { data: dashboardSummary } = useDashboard()
  const { data: recentInterviews } = useInterviews({
    limit: RECENT_INTERVIEWS_LIMIT,
  })
  const { data: inProgressInterviews } = useInterviews({
    status: "in_progress",
    limit: 1,
  })

  const resumeInterview = inProgressInterviews[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Welcome />
        <div className="flex flex-row gap-4">
          {resumeInterview && (
            <Link
              to="/interviews/$interviewId"
              params={{ interviewId: resumeInterview.id }}
              className={buttonVariants({ variant: "confirmation" })}
            >
              <Play /> Resume
            </Link>
          )}

          <CreateInterviewDialog />
        </div>
      </div>
      <StatGrid summary={dashboardSummary}>
        <RecentInterviewsList recentInterviews={recentInterviews} />{" "}
      </StatGrid>
    </div>
  )
}
