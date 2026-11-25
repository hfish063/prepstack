import {
  createHintForQuestionApiQuestionsQuestionIdHintsPostMutation,
  getMessagesForQuestionApiQuestionsQuestionIdMessagesGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type RequestHintMutationConfig = Omit<
  ReturnType<
    typeof createHintForQuestionApiQuestionsQuestionIdHintsPostMutation
  >,
  "mutationFn"
>

type UseRequestHintOptions = {
  mutationConfig?: RequestHintMutationConfig
}

export function useRequestHint({ mutationConfig }: UseRequestHintOptions = {}) {
  const queryClient = useQueryClient()

  const { ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: (_, { path }) => {
      queryClient.invalidateQueries({
        queryKey:
          getMessagesForQuestionApiQuestionsQuestionIdMessagesGetQueryKey({
            path,
          }),
      })
    },
    ...restConfig,
    mutationFn:
      createHintForQuestionApiQuestionsQuestionIdHintsPostMutation().mutationFn,
  })
}
