import { deleteProblemSubmissionsApiCodingProblemsPhaseIdSubmissionsDeleteAllDeleteMutation } from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getSubmissionsQueryOptions } from "./use-submissions"

type DeleteSubmissionsMutationConfig = Omit<
  ReturnType<
    typeof deleteProblemSubmissionsApiCodingProblemsPhaseIdSubmissionsDeleteAllDeleteMutation
  >,
  "mutationFn"
>

type UseDeleteSubmissionsOptions = {
  mutationConfig?: DeleteSubmissionsMutationConfig
}

export function useDeleteSubmissions({
  mutationConfig,
}: UseDeleteSubmissionsOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: async (...args) => {
      const [, variables] = args
      await queryClient.invalidateQueries({
        queryKey: getSubmissionsQueryOptions(variables.path.phase_id).queryKey,
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn:
      deleteProblemSubmissionsApiCodingProblemsPhaseIdSubmissionsDeleteAllDeleteMutation()
        .mutationFn,
  })
}
