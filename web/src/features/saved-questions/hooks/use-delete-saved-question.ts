import {
  deleteSavedQuestionApiSavedQuestionsSavedQuestionIdDeleteDeleteMutation,
  findAllSavedQuestionsApiSavedQuestionsAllGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type DeleteSavedQuestionMutationConfig = Omit<
  ReturnType<
    typeof deleteSavedQuestionApiSavedQuestionsSavedQuestionIdDeleteDeleteMutation
  >,
  "mutationFn"
>

type UseDeleteSavedQuestionOptions = {
  mutationConfig?: DeleteSavedQuestionMutationConfig
}

export function useDeleteSavedQuestion({
  mutationConfig,
}: UseDeleteSavedQuestionOptions = {}) {
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
      deleteSavedQuestionApiSavedQuestionsSavedQuestionIdDeleteDeleteMutation()
        .mutationFn,
  })
}
