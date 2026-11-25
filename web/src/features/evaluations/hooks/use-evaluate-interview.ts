import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  evaluateInterviewSessionApiInterviewsInterviewIdEvaluatePostMutation,
  findAllInterviewSessionsApiInterviewsAllGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen"
import { getInterviewSummaryOptions } from "./use-interview-summary"

type EvaluateInterviewMutationConfig = Omit<
  ReturnType<
    typeof evaluateInterviewSessionApiInterviewsInterviewIdEvaluatePostMutation
  >,
  "mutationFn"
>

type UseEvaluateInterviewOptions = {
  mutationConfig?: EvaluateInterviewMutationConfig
}

export function useEvaluateInterview({
  mutationConfig,
}: UseEvaluateInterviewOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: (...args) => {
      const [summary, variables] = args

      queryClient.setQueryData(
        getInterviewSummaryOptions(variables.path.interview_id).queryKey,
        summary
      )
      queryClient.invalidateQueries({
        queryKey: findAllInterviewSessionsApiInterviewsAllGetQueryKey(),
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn:
      evaluateInterviewSessionApiInterviewsInterviewIdEvaluatePostMutation()
        .mutationFn,
  })
}
