import AnalysisResults from "@/features/saved-questions/components/analysis-results"
import { getSavedQuestionQueryOptions } from "@/features/saved-questions/hooks/use-saved-question"
import { getSavedQuestionAnalysisQueryOptions } from "@/features/saved-questions/hooks/use-saved-question-analyses"
import { isNotFoundError } from "@/lib/api/errors"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import z from "zod"

const idSchema = z.coerce.number().int().positive()

export const Route = createFileRoute(
  "/_protected/question-bank/$questionId/analyze"
)({
  loader: async ({ context, params }) => {
    const result = idSchema.safeParse(params.questionId)

    if (!result.success) {
      throw redirect({ to: "/question-bank" })
    }

    const savedQuestionId = result.data

    try {
      await Promise.all([
        await context.queryClient.query(
          getSavedQuestionAnalysisQueryOptions(savedQuestionId)
        ),
        await context.queryClient.query(
          getSavedQuestionQueryOptions(savedQuestionId)
        ),
      ])
    } catch (error) {
      if (isNotFoundError(error)) {
        throw notFound({
          data: { message: "This question has not been analyzed." },
        })
      }

      throw error
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <AnalysisResults />
}
