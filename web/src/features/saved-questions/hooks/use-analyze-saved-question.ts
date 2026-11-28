import {
  analyzeSavedQuestionApiSavedQuestionsSavedQuestionIdAnalyzePostMutation,
  findAllSavedQuestionsApiSavedQuestionsAllGetQueryKey,
  findSavedQuestionAnalysisApiSavedQuestionsSavedQuestionIdAnalysisGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type AnalyzeSavedQuestionMutationConfig = Omit<
  ReturnType<
    typeof analyzeSavedQuestionApiSavedQuestionsSavedQuestionIdAnalyzePostMutation
  >,
  "mutationFn"
>

type UseAnalyzeSavedQuestionOptions = {
  mutationConfig?: AnalyzeSavedQuestionMutationConfig
}

export function useAnalyzeQuestion({
  mutationConfig,
}: UseAnalyzeSavedQuestionOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: (analysis, variables, ...rest) => {
      queryClient.setQueryData(
        findSavedQuestionAnalysisApiSavedQuestionsSavedQuestionIdAnalysisGetQueryKey(
          { path: variables.path }
        ),
        analysis
      )
      queryClient.invalidateQueries({
        queryKey: findAllSavedQuestionsApiSavedQuestionsAllGetQueryKey(),
      })
      onSuccess?.(analysis, variables, ...rest)
    },
    ...restConfig,
    mutationFn:
      analyzeSavedQuestionApiSavedQuestionsSavedQuestionIdAnalyzePostMutation()
        .mutationFn,
  })
}
