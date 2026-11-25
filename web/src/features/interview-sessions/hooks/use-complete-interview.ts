import {
  completeInterviewSessionApiInterviewsInterviewIdCompletePostMutation,
  findAllInterviewSessionsApiInterviewsAllGetQueryKey,
  findInterviewSessionApiInterviewsInterviewIdGetQueryKey,
  findPhasesForInterviewApiInterviewsInterviewIdPhasesGetQueryKey,
  getDashboardSummaryApiDashboardGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type CompleteInterviewMutationConfig = Omit<
  ReturnType<
    typeof completeInterviewSessionApiInterviewsInterviewIdCompletePostMutation
  >,
  "mutationFn"
>

type UseCompleteInterviewOptions = {
  mutationConfig?: CompleteInterviewMutationConfig
}

export function useCompleteInterview({
  mutationConfig,
}: UseCompleteInterviewOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: async (...args) => {
      const [, variables] = args
      const { path } = variables

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: findAllInterviewSessionsApiInterviewsAllGetQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: findInterviewSessionApiInterviewsInterviewIdGetQueryKey({
            path,
          }),
        }),
        queryClient.invalidateQueries({
          queryKey:
            findPhasesForInterviewApiInterviewsInterviewIdPhasesGetQueryKey({
              path,
            }),
        }),
        queryClient.invalidateQueries({
          queryKey: getDashboardSummaryApiDashboardGetQueryKey(),
        }),
      ])
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn:
      completeInterviewSessionApiInterviewsInterviewIdCompletePostMutation()
        .mutationFn,
  })
}
