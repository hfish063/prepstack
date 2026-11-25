import { getCodingProblemLanguageTemplateApiCodingProblemsPhaseIdTemplateGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getLanguageTemplateQueryOptions(
  phaseId: number,
  languageId: number
) {
  return queryOptions(
    getCodingProblemLanguageTemplateApiCodingProblemsPhaseIdTemplateGetOptions({
      path: { phase_id: phaseId },
      query: { language_id: languageId },
    })
  )
}

export function useLanguageTemplate(phaseId: number, languageId: number) {
  return useSuspenseQuery(getLanguageTemplateQueryOptions(phaseId, languageId))
}
