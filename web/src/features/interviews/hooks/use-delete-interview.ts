import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  deleteInterviewSessionApiInterviewsDeleteInterviewIdDeleteMutation,
  findAllInterviewSessionsApiInterviewsAllGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen"

type DeleteInterviewMutationConfig = Omit<
  ReturnType<
    typeof deleteInterviewSessionApiInterviewsDeleteInterviewIdDeleteMutation
  >,
  "mutationFn"
>

type UseCreateInterviewOptions = {
  mutationConfig?: DeleteInterviewMutationConfig
}

export function useDeleteInterview({
  mutationConfig,
}: UseCreateInterviewOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: findAllInterviewSessionsApiInterviewsAllGetQueryKey(),
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn:
      deleteInterviewSessionApiInterviewsDeleteInterviewIdDeleteMutation()
        .mutationFn,
  })
}
