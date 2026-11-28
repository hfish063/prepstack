import { findAllSavedQuestionsApiSavedQuestionsAllGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getSavedQuestionsQueryOptions() {
  return queryOptions(findAllSavedQuestionsApiSavedQuestionsAllGetOptions())
}

export function useSavedQuestions() {
  return useSuspenseQuery(getSavedQuestionsQueryOptions())
}
