import { getMessagesForQuestionApiQuestionsQuestionIdMessagesGetOptions } from "@/lib/api/generated/@tanstack/react-query.gen"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

export function getMessagesQueryOptions(questionId: number) {
  return queryOptions(
    getMessagesForQuestionApiQuestionsQuestionIdMessagesGetOptions({
      path: { question_id: questionId },
    })
  )
}

export function useMessages(questionId: number) {
  return useSuspenseQuery(getMessagesQueryOptions(questionId))
}
