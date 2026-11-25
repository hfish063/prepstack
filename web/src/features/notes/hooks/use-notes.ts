import { getInterviewNotesApiInterviewsInterviewIdNotesGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getNotesQueryOptions(interviewId: number) {
  return queryOptions(
    getInterviewNotesApiInterviewsInterviewIdNotesGetOptions({
      path: { interview_id: interviewId },
    })
  )
}

export function useNotes(interviewId: number) {
  return useSuspenseQuery(getNotesQueryOptions(interviewId))
}
