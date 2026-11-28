import { createQuestionApiQuestionsPhaseIdPostMutation } from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getQuestionsQueryOptions } from "./use-questions"

type AddQuestionMutationConfig = Omit<
  ReturnType<typeof createQuestionApiQuestionsPhaseIdPostMutation>,
  "mutationFn"
>

type UseAddQuestionOptions = {
  mutationConfig?: AddQuestionMutationConfig
}

export function useAddQuestion({
  mutationConfig,
}: UseAddQuestionOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: (data, variables, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: getQuestionsQueryOptions(variables.path.phase_id).queryKey,
      })
      onSuccess?.(data, variables, ...rest)
    },
    ...restConfig,
    mutationFn: createQuestionApiQuestionsPhaseIdPostMutation().mutationFn,
  })
}
