import { findSavedQuestionApiSavedQuestionsSavedQuestionIdGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getSavedQuestionQueryOptions(savedQuestionId: number) {
  return queryOptions(
    findSavedQuestionApiSavedQuestionsSavedQuestionIdGetOptions({
      path: { saved_question_id: savedQuestionId },
    })
  )
}

export function useSavedQuestion(savedQuestionId: number) {
  return useSuspenseQuery(getSavedQuestionQueryOptions(savedQuestionId))
}
