import { findInterviewSessionApiInterviewsInterviewIdGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getInterviewQueryOptions(interviewId: number) {
  return queryOptions(
    findInterviewSessionApiInterviewsInterviewIdGetOptions({
      path: { interview_id: interviewId },
    })
  )
}

export function useInterview(interviewId: number) {
  return useSuspenseQuery(getInterviewQueryOptions(interviewId))
}
