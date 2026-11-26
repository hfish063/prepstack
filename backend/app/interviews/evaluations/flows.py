from sqlmodel import Session

from app.enums import InterviewStatus
from app.exceptions import ResourceConflictError, ResourceNotFoundError
from app.interviews.evaluations import service as evaluation_service
from app.interviews.evaluations.evaluators import get_evaluator
from app.interviews.evaluations.mappers import to_summary_read
from app.interviews.evaluations.models import InterviewPhaseEvaluation, InterviewSummary
from app.interviews.evaluations.schemas import (
    InterviewStatsRead,
    InterviewSummaryRead,
)
from app.interviews.phases import service as phase_service
from app.interviews.phases.models import InterviewPhase
from app.interviews.sessions.models import InterviewSession
from app.messages import service as message_service
from app.openai import service as openai_service
from app.questions import service as question_service
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

    return _build_summary_read(db, summary, phase_evaluations)


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

    return _build_summary_read(db, summary, phase_evaluations)


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


def _build_summary_read(
    db: Session,
    summary: InterviewSummary,
    phase_evaluations: list[InterviewPhaseEvaluation],
) -> InterviewSummaryRead:
    submission_stats = None
    answered, messages, hints = message_service.get_message_stats(
        db, summary.interview_id
    )
    questions = question_service.get_count_for_interview(db, summary.interview_id)

    for evaluation in phase_evaluations:
        if evaluation.coding_evaluation:
            submission_stats = submission_service.get_submission_stats(
                db, evaluation.phase
            )

    interview_stats = InterviewStatsRead(
        answered_questions=answered,
        total_questions=questions,
        message_count=messages,
        hints_used=hints,
    )

    return to_summary_read(
        summary, phase_evaluations, interview_stats, submission_stats
    )
