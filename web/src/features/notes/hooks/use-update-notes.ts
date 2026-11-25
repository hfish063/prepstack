import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateInterviewNotesApiInterviewsInterviewIdNotesUpdatePutMutation } from "@/lib/api/generated/@tanstack/react-query.gen"
import { getNotesQueryOptions } from "./use-notes"

type UpdateNotesMutationConfig = Omit<
  ReturnType<
    typeof updateInterviewNotesApiInterviewsInterviewIdNotesUpdatePutMutation
  >,
  "mutationFn"
>

type UseUpdateNotesOptions = {
  mutationConfig?: UpdateNotesMutationConfig
}

export function useUpdateNotes({ mutationConfig }: UseUpdateNotesOptions = {}) {
  const queryClient = useQueryClient()

  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  return useMutation({
    onSuccess: async (...args) => {
      const [, variables] = args
      await queryClient.invalidateQueries({
        queryKey: getNotesQueryOptions(variables.path.interview_id).queryKey,
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn:
      updateInterviewNotesApiInterviewsInterviewIdNotesUpdatePutMutation()
        .mutationFn,
  })
}
