import { isNotFoundError } from "@/lib/api/errors"
import { getInterviewNotesApiInterviewsInterviewIdNotesGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getNotesQueryOptions(interviewId: number) {
  const { queryKey, queryFn } =
    getInterviewNotesApiInterviewsInterviewIdNotesGetOptions({
      path: { interview_id: interviewId },
    })

  return queryOptions({
    queryKey,
    queryFn: async (context) => {
      try {
        return await queryFn!(context)
      } catch (error) {
        if (isNotFoundError(error)) {
          return null
        }

        throw error
      }
    },
  })
}

export function useNotes(interviewId: number) {
  return useSuspenseQuery(getNotesQueryOptions(interviewId))
}
