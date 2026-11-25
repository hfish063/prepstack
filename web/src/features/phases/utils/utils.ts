import type { InterviewPhaseRead, PhaseType } from "@/lib/api/generated"

/**
 * Helper function to find the currently active phase in a provided
 * list of InterviewPhaseRead[] objects.
 *
 * @param phases provided list of interview phases
 * @returns the currently active phase (status is 'in_progress'), undefined if there is not an active phase.
 */
export function findCurrentPhase(phases: InterviewPhaseRead[]) {
  return phases.find((phase) => phase.status === "in_progress")
}

/**
 * Helper function to find a phase by it's phaseType attribute. Searches list of interview
 * phases and returns the first instance of target phaseType.
 *
 * @param phases provided list of interview phases
 * @param type the target phaseType that is being searched for.
 * @returns the phase with matching phaseType, undefined if there are not any matches.
 */
export function findPhaseByType(phases: InterviewPhaseRead[], type: PhaseType) {
  return phases.find((phase) => phase.phaseType === type)
}
