import { getQuestionsForPhaseApiQuestionsPhaseIdAllGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getQuestionsQueryOptions(phaseId: number) {
  return queryOptions(
    getQuestionsForPhaseApiQuestionsPhaseIdAllGetOptions({
      path: { phase_id: phaseId },
    })
  )
}

export function useQuestions(phaseId: number) {
  return useSuspenseQuery(getQuestionsQueryOptions(phaseId))
}
