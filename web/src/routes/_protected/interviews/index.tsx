import { Card, CardContent } from "@/components/ui/card"
import CreateInterviewDialog from "@/features/interviews/components/create-dialog"
import InterviewsView from "@/features/interviews/components/view"
import {
  getInterviewsQueryOptions,
  useInterviews,
} from "@/features/interviews/hooks/use-interviews"
import { createFileRoute } from "@tanstack/react-router"
import { Bot } from "lucide-react"
import { z } from "zod"

const searchSchema = z.object({
  view: z.enum(["list", "grid"]).optional().catch(undefined),
  status: z.enum(["in_progress", "completed"]).optional().catch(undefined),
})

export const Route = createFileRoute("/_protected/interviews/")({
  loader: ({ context }) =>
    context.queryClient.query(getInterviewsQueryOptions()),
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { data: interviews } = useInterviews()

  return (
    <div className="flex flex-col gap-4">
      <div className="text-4xl font-semibold">Interviews</div>
      <p className="text-muted-foreground">
        Practice with AI-powered interviews tailored to your goals.
      </p>
      <Card>
        <CardContent className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-4">
            <Bot className="shrink-0" size={36} />
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-semibold">Ready to practice?</div>
              <p className="hidden text-muted-foreground sm:block">
                Start a new interview to get personalized questions, real-time
                feedback, and improve your skills.
              </p>
            </div>
          </div>
          <CreateInterviewDialog />
        </CardContent>
      </Card>
      <InterviewsView interviews={interviews} />
    </div>
  )
}
