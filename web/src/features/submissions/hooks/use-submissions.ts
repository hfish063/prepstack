import { getProblemSubmissionsApiCodingProblemsPhaseIdSubmissionsGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getSubmissionsQueryOptions(phaseId: number) {
  return queryOptions(
    getProblemSubmissionsApiCodingProblemsPhaseIdSubmissionsGetOptions({
      path: { phase_id: phaseId },
    })
  )
}

export function useSubmissions(phaseId: number) {
  return useSuspenseQuery(getSubmissionsQueryOptions(phaseId))
}
