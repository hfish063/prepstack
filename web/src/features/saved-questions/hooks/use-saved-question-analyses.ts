import { findSavedQuestionAnalysisApiSavedQuestionsSavedQuestionIdAnalysisGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getSavedQuestionAnalysisQueryOptions(savedQuestionId: number) {
  return queryOptions(
    findSavedQuestionAnalysisApiSavedQuestionsSavedQuestionIdAnalysisGetOptions(
      { path: { saved_question_id: savedQuestionId } }
    )
  )
}

export function useSavedQuestionAnalysis(savedQuestionId: number) {
  return useSuspenseQuery(getSavedQuestionAnalysisQueryOptions(savedQuestionId))
}
