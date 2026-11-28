import {
  createSavedQuestionApiSavedQuestionsSavePostMutation,
  findAllSavedQuestionsApiSavedQuestionsAllGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type SaveQuestionMutationConfig = Omit<
  ReturnType<typeof createSavedQuestionApiSavedQuestionsSavePostMutation>,
  "mutationFn"
>

type UseSaveQuestionOptions = {
  mutationConfig?: SaveQuestionMutationConfig
}

export function useSaveQuestion({
  mutationConfig,
}: UseSaveQuestionOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: findAllSavedQuestionsApiSavedQuestionsAllGetQueryKey(),
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn:
      createSavedQuestionApiSavedQuestionsSavePostMutation().mutationFn,
  })
}
