from sqlmodel import Session

from app.enums import InterviewStatus
from app.exceptions import ResourceConflictError, ResourceNotFoundError
from app.interviews.evaluations import service as evaluation_service
from app.interviews.evaluations.evaluators import get_evaluator
from app.interviews.evaluations.models import InterviewPhaseEvaluation, InterviewSummary
from app.interviews.evaluations.schemas import (
    CodingEvaluationRead,
    InterviewPhaseEvaluationRead,
    InterviewSummaryRead,
)
from app.interviews.phases import service as phase_service
from app.interviews.phases.models import InterviewPhase
from app.interviews.sessions.models import InterviewSession
from app.openai import service as openai_service
from app.submissions import service as submission_service


def get_interview_summary(
    db: Session, interview: InterviewSession
) -> InterviewSummaryRead:
    summary = evaluation_service.get_summary_by_interview(db, interview)
    if not summary:
        raise ResourceNotFoundError("This interview has not been evaluated.")

    phase_evaluations = evaluation_service.get_phase_evaluations_by_interview(
        db, interview
    )

    return _to_summary_read(db, summary, phase_evaluations)


def evaluate_interview(
    db: Session, interview: InterviewSession
) -> InterviewSummaryRead:
    """Evaluates each phase of a completed interview, then generates an overall summary.

    Phase evaluations are saved as they are generated, so a failed run resumes
    from the first unevaluated phase instead of starting over.
    """
    if interview.status != InterviewStatus.COMPLETED:
        raise ResourceConflictError(
            "Cannot generate evaluations for incomplete interviews."
        )

    if evaluation_service.get_summary_by_interview(db, interview):
        raise ResourceConflictError("This interview has already been evaluated.")

    phases = phase_service.get_phases_for_interview(db, interview)

    phase_evaluations = [_get_or_create_phase_evaluation(db, phase) for phase in phases]

    summary_create = openai_service.generate_interview_summary(
        interview, phase_evaluations
    )

    summary = evaluation_service.save_summary(db, interview, summary_create)

    return _to_summary_read(db, summary, phase_evaluations)


def _get_or_create_phase_evaluation(
    db: Session, phase: InterviewPhase
) -> InterviewPhaseEvaluation:
    """Retrieves existing evaluations from the database for the provided phase.

    If the phase has not been evaluated yet, generates an evaluation report from the OpenAI client.
    """
    existing = evaluation_service.get_phase_evaluation(db, phase)
    if existing:
        return existing

    evaluation_create = get_evaluator(phase).evaluate(db)

    return evaluation_service.save_phase_evaluation(db, phase, evaluation_create)


def _to_summary_read(
    db: Session, summary: InterviewSummary, evaluations: list[InterviewPhaseEvaluation]
) -> InterviewSummaryRead:
    return InterviewSummaryRead(
        overall_score=summary.overall_score,
        summary=summary.summary,
        phase_evaluations=[
            InterviewPhaseEvaluationRead(
                score=evaluation.score,
                summary=evaluation.summary,
                phase_type=evaluation.phase.phase_type,
                coding_evaluation=_to_coding_evaluation_read(db, evaluation),
            )
            for evaluation in evaluations
        ],
    )


def _to_coding_evaluation_read(
    db: Session, evaluation: InterviewPhaseEvaluation
) -> CodingEvaluationRead | None:
    coding_evaluation = evaluation.coding_evaluation

    if not coding_evaluation:
        return None

    return CodingEvaluationRead(
        time_complexity=coding_evaluation.time_complexity,
        space_complexity=coding_evaluation.space_complexity,
        complexity_reasoning=coding_evaluation.complexity_reasoning,
        submission=coding_evaluation.submission,
        submission_stats=submission_service.get_submission_stats(db, evaluation.phase),
    )
