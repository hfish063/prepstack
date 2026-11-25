import type { FindAllInterviewSessionsApiInterviewsAllGetData } from "@/lib/api/generated"
import { findAllInterviewSessionsApiInterviewsAllGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

type InterviewsQuery = FindAllInterviewSessionsApiInterviewsAllGetData["query"]

export function getInterviewsQueryOptions(query?: InterviewsQuery) {
  return queryOptions(
    findAllInterviewSessionsApiInterviewsAllGetOptions({ query })
  )
}

export function useInterviews(query?: InterviewsQuery) {
  return useSuspenseQuery(getInterviewsQueryOptions(query))
}
