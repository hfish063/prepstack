import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  findAllInterviewSessionsApiInterviewsAllGetQueryKey,
  saveInterviewSessionApiInterviewsSavePostMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen"

type CreateInterviewMutationConfig = Omit<
  ReturnType<typeof saveInterviewSessionApiInterviewsSavePostMutation>,
  "mutationFn"
>

type UseCreateInterviewOptions = {
  mutationConfig?: CreateInterviewMutationConfig
}

export function useCreateInterview({
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
    mutationFn: saveInterviewSessionApiInterviewsSavePostMutation().mutationFn,
  })
}
