import { createSavedQuestionApiSavedQuestionsSavePostMutation } from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getSavedQuestionsQueryOptions } from "./use-saved-questions"

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
    onSuccess: async (...args) => {
      const { queryKey } = getSavedQuestionsQueryOptions()
      await queryClient.invalidateQueries({ queryKey })
      await onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn:
      createSavedQuestionApiSavedQuestionsSavePostMutation().mutationFn,
  })
}
