import { ApiError } from "@/lib/api-client"
import { getInterviewSummaryApiInterviewsInterviewIdEvaluateGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getInterviewSummaryOptions(interviewId: number) {
  const { queryKey, queryFn } =
    getInterviewSummaryApiInterviewsInterviewIdEvaluateGetOptions({
      path: { interview_id: interviewId },
    })

  return queryOptions({
    queryKey,
    queryFn: async (context) => {
      try {
        return await queryFn!(context)
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
      }
    },
  })
}

export function useInterviewSummary(interviewId: number) {
  return useSuspenseQuery(getInterviewSummaryOptions(interviewId))
}
