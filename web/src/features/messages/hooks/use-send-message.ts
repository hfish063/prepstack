import {
  createMessageForQuestionApiQuestionsQuestionIdMessagesPostMutation,
  getMessagesForQuestionApiQuestionsQuestionIdMessagesGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type SendMessageMutationConfig = Omit<
  ReturnType<
    typeof createMessageForQuestionApiQuestionsQuestionIdMessagesPostMutation
  >,
  "mutationFn"
>

type UseSendMessageOptions = {
  mutationConfig?: SendMessageMutationConfig
}

export function useSendMessage({ mutationConfig }: UseSendMessageOptions = {}) {
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
      createMessageForQuestionApiQuestionsQuestionIdMessagesPostMutation()
        .mutationFn,
  })
}
