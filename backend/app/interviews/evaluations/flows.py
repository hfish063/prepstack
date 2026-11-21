from sqlmodel import Session

from app.enums import InterviewStatus
from app.exceptions import ResourceConflictError, ResourceNotFoundError
from app.interviews.evaluations import service as evaluation_service
from app.interviews.evaluations.models import InterviewPhaseEvaluation, InterviewSummary
from app.interviews.evaluations.schemas import InterviewSummaryRead
from app.interviews.phases import service as phase_service
from app.interviews.phases.models import InterviewPhase
from app.interviews.sessions.models import InterviewSession
from app.messages import service as message_service
from app.openai import service as openai_service
from app.questions import service as question_service
from app.questions.flows import supports_questions


def get_interview_summary(
    db: Session, interview: InterviewSession
) -> InterviewSummaryRead:
    summary = evaluation_service.get_summary_by_interview(db, interview)
    if not summary:
        raise ResourceNotFoundError("This interview has not been evaluated.")

    phase_evaluations = evaluation_service.get_phase_evaluations_by_interview(
        db, interview
    )

    return _to_summary_read(summary, phase_evaluations)


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

    phase_evaluations = [
        _get_or_create_phase_evaluation(db, phase)
        for phase in phases
        if supports_questions(phase)
    ]

    summary_create = openai_service.generate_interview_summary(
        interview, phase_evaluations
    )

    summary = evaluation_service.save_summary(db, interview, summary_create)

    return _to_summary_read(summary, phase_evaluations)


def _get_or_create_phase_evaluation(
    db: Session, phase: InterviewPhase
) -> InterviewPhaseEvaluation:
    existing = evaluation_service.get_phase_evaluation(db, phase)
    if existing:
        return existing

    questions = question_service.get_all(db, phase)
    messages = message_service.get_all_by_phase(db, phase)
    evaluation_create = openai_service.generate_phase_evaluation(
        phase, questions, messages
    )

    return evaluation_service.save_phase_evaluation(db, phase, evaluation_create)


def _to_summary_read(
    summary: InterviewSummary, evaluations: list[InterviewPhaseEvaluation]
) -> InterviewSummaryRead:
    return InterviewSummaryRead(
        overall_score=summary.overall_score,
        summary=summary.summary,
        phase_evaluations=evaluations,
    )
