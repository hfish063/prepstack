import { advancePhaseApiPhasesPhaseIdAdvanceTargetPhaseIndexPostMutation } from "@/lib/api/generated/@tanstack/react-query.gen"
import { getPhasesQueryOptions } from "@/features/phases/hooks/use-phases"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type AdvancePhaseMutationConfig = Omit<
  ReturnType<
    typeof advancePhaseApiPhasesPhaseIdAdvanceTargetPhaseIndexPostMutation
  >,
  "mutationFn"
>

type UseAdvancePhaseOptions = {
  mutationConfig?: AdvancePhaseMutationConfig
}

export function useAdvancePhase({
  mutationConfig,
}: UseAdvancePhaseOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: async (...args) => {
      const [phase] = args
      await queryClient.invalidateQueries({
        queryKey: getPhasesQueryOptions(phase.interviewId).queryKey,
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn:
      advancePhaseApiPhasesPhaseIdAdvanceTargetPhaseIndexPostMutation()
        .mutationFn,
  })
}
