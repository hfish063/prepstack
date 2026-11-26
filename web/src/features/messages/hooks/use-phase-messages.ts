import { findMessagesForPhaseApiPhasesPhaseIdMessagesGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useQuery } from "@tanstack/react-query"

export function getMessagesForPhaseQueryOptions(phaseId: number) {
  return queryOptions(
    findMessagesForPhaseApiPhasesPhaseIdMessagesGetOptions({
      path: { phase_id: phaseId },
    })
  )
}

export function usePhaseMessages(phaseId: number) {
  return useQuery(getMessagesForPhaseQueryOptions(phaseId))
}
