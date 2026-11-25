import { getCodingProblemApiCodingProblemsPhaseIdGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getCodingProblemQueryOptions(phaseId: number) {
  return queryOptions(
    getCodingProblemApiCodingProblemsPhaseIdGetOptions({
      path: { phase_id: phaseId },
    })
  )
}

export function useCodingProblem(phaseId: number) {
  return useSuspenseQuery(getCodingProblemQueryOptions(phaseId))
}
