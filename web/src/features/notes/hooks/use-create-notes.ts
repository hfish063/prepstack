import { useMutation, useQueryClient } from "@tanstack/react-query"

import { saveInterviewNotesApiInterviewsInterviewIdNotesSavePostMutation } from "@/lib/api/generated/@tanstack/react-query.gen"
import { getNotesQueryOptions } from "./use-notes"

type CreateNotesMutationConfig = Omit<
  ReturnType<
    typeof saveInterviewNotesApiInterviewsInterviewIdNotesSavePostMutation
  >,
  "mutationFn"
>

type UseCreateNotesOptions = {
  mutationConfig?: CreateNotesMutationConfig
}

export function useCreateNotes({ mutationConfig }: UseCreateNotesOptions = {}) {
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
      saveInterviewNotesApiInterviewsInterviewIdNotesSavePostMutation()
        .mutationFn,
  })
}
