import { InterviewPhaseEvaluation } from "@/app/api/interview-evaluations";
import { PhaseType } from "@/app/api/interview-phases";

export function findEvaluationByPhaseType(
  evaluations: InterviewPhaseEvaluation[],
  target: PhaseType,
) {
  const result = evaluations.find(
    (evaluation) => evaluation.phaseType === target,
  );

  return result;
}
