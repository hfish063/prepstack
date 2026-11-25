import { runCodeApiCodingProblemsPhaseIdRunPostMutation } from "@/lib/api/generated/@tanstack/react-query.gen"
import { useMutation } from "@tanstack/react-query"

type RunCodeMutationConfig = Omit<
  ReturnType<typeof runCodeApiCodingProblemsPhaseIdRunPostMutation>,
  "mutationFn"
>

type UseRunCodeOptions = {
  mutationConfig?: RunCodeMutationConfig
}

export function useRunCode({ mutationConfig }: UseRunCodeOptions = {}) {
  return useMutation({
    ...mutationConfig,
    mutationFn: runCodeApiCodingProblemsPhaseIdRunPostMutation().mutationFn,
  })
}
