import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteInterviewNotesApiInterviewsInterviewIdNotesDeleteDeleteMutation } from "@/lib/api/generated/@tanstack/react-query.gen"
import { getNotesQueryOptions } from "./use-notes"

type DeleteNotesMutationConfig = Omit<
  ReturnType<
    typeof deleteInterviewNotesApiInterviewsInterviewIdNotesDeleteDeleteMutation
  >,
  "mutationFn"
>

type UseDeleteNotesOptions = {
  mutationConfig?: DeleteNotesMutationConfig
}

export function useDeleteNotes({ mutationConfig }: UseDeleteNotesOptions = {}) {
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
      deleteInterviewNotesApiInterviewsInterviewIdNotesDeleteDeleteMutation()
        .mutationFn,
  })
}
