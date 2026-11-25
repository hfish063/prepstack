import type {
  InterviewPhaseEvaluationRead,
  PhaseType,
} from "@/lib/api/generated"

/**
 * Searches a list of interview phase evaluations, returns the first instance
 * of a phase evaluation with phase type attribute matching the target type.
 *
 * @param evaluations list of interview phase evaluation to search within
 * @param target the target evaluation phase type
 * @returns first interview phase evaluation found that matches target phase type.
 *          Undefined if there are no matching evaluations.
 */
export function findEvaluationByPhaseType(
  evaluations: InterviewPhaseEvaluationRead[],
  target: PhaseType
) {
  const result = evaluations.find(
    (evaluation) => evaluation.phaseType === target
  )

  return result
}
