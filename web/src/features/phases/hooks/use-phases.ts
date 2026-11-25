import { findPhasesForInterviewApiInterviewsInterviewIdPhasesGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getPhasesQueryOptions(interviewId: number) {
  return queryOptions(
    findPhasesForInterviewApiInterviewsInterviewIdPhasesGetOptions({
      path: { interview_id: interviewId },
    })
  )
}

export function usePhases(interviewId: number) {
  return useSuspenseQuery(getPhasesQueryOptions(interviewId))
}
