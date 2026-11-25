import {
  getProblemSubmissionsApiCodingProblemsPhaseIdSubmissionsGetQueryKey,
  submitCodeApiCodingProblemsPhaseIdSubmitPostMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type SubmitCodeMutationConfig = Omit<
  ReturnType<typeof submitCodeApiCodingProblemsPhaseIdSubmitPostMutation>,
  "mutationFn"
>

type UseSubmitCodeOptions = {
  mutationConfig?: SubmitCodeMutationConfig
}

export function useSubmitCode({ mutationConfig }: UseSubmitCodeOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: async (...args) => {
      const [, variables] = args
      await queryClient.invalidateQueries({
        queryKey:
          getProblemSubmissionsApiCodingProblemsPhaseIdSubmissionsGetQueryKey({
            path: { phase_id: variables.path.phase_id },
          }),
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn:
      submitCodeApiCodingProblemsPhaseIdSubmitPostMutation().mutationFn,
  })
}
