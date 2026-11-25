import { getPhasesQueryOptions } from "@/features/phases/hooks/use-phases"
import { findCurrentPhase } from "@/features/phases/utils/utils"
import type { PhaseType } from "@/lib/api/generated"
import type { QueryClient } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"
import { getQuestionsQueryOptions } from "../hooks/use-questions"
import { z } from "zod"

type QuestionPhaseType = Exclude<PhaseType, "technical">

export const questionSearchSchema = z.object({
  question: z.number().int().positive().optional().catch(undefined),
})

type LoadPhaseQuestionsOptions = {
  queryClient: QueryClient
  interviewId: number
  phaseType: QuestionPhaseType
}

export async function loadPhaseQuestions({
  queryClient,
  interviewId,
  phaseType,
}: LoadPhaseQuestionsOptions) {
  const phases = await queryClient.query(getPhasesQueryOptions(interviewId))

  const currentPhase = findCurrentPhase(phases)

  if (!currentPhase) return

  if (currentPhase.phaseType !== phaseType) {
    throw redirect({
      to: `/interviews/$interviewId/${currentPhase.phaseType}`,
      params: { interviewId },
    })
  }

  await queryClient.query(getQuestionsQueryOptions(currentPhase.id))
}
