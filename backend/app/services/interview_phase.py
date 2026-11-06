from datetime import datetime, timezone

from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import SQLAlchemyError

from app.enums import PhaseStatus, PhaseType
from app.models.coding_problem import CodingProblem
from app.models.interview_phase import InterviewPhase
from app.models.interview_session import InterviewSession
from app.models.problem_example import ProblemExample
from app.models.problem_language_template import ProblemLanguageTemplate
from app.models.programming_language import ProgrammingLanguage
from app.services.coding_problem import get_coding_problem
from app.services.message import get_phase_messages
from app.services.problem_example import get_examples_for_problem
from app.services.problem_language_template import get_language_template_for_problem
from app.services.programming_language import get_available_languages_for_problem


def create_interview_phases(db: Session, interview_id: int) -> list[InterviewPhase]:
    phases = [
        InterviewPhase(
            interview_id=interview_id,
            phase_type=PhaseType.BEHAVIORAL,
            order_index=0,
            status=PhaseStatus.IN_PROGRESS,
        ),
        InterviewPhase(
            interview_id=interview_id,
            phase_type=PhaseType.CONCEPTUAL,
            order_index=1,
            status=PhaseStatus.PENDING,
        ),
        InterviewPhase(
            interview_id=interview_id,
            # Assign coding problem id for technical portion of interview
            # coding_problem_id = 1,
            phase_type=PhaseType.TECHNICAL,
            order_index=2,
            status=PhaseStatus.PENDING,
        ),
    ]

    try:
        db.add_all(phases)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    return phases


def get_phase_for_user(db: Session, phase_id: int, user_id: str) -> InterviewPhase:
    statement = (
        select(InterviewPhase)
        .join(InterviewSession, InterviewPhase.interview_id == InterviewSession.id)
        .where(InterviewPhase.id == phase_id, InterviewSession.user_id == user_id)
    )
    phase = db.exec(statement).first()

    if not phase:
        raise HTTPException(status_code=404, detail="Interview phase not found")

    return phase


def get_phases_for_interview(
    db: Session, user_id: str, interview_id: int
) -> list[InterviewPhase]:
    statement = (
        select(InterviewPhase)
        .join(InterviewSession, InterviewPhase.interview_id == InterviewSession.id)
        .where(
            InterviewPhase.interview_id == interview_id,
            InterviewSession.user_id == user_id,
        )
        .order_by(InterviewPhase.order_index)
    )
    phases = db.exec(statement).all()

    if not phases:
        raise HTTPException(status_code=404, detail="Interview not found")

    return phases


ADVANCE_BREAKPOINT = 15  # Attempt to trigger a phase transition if user's message count reaches breakpoint for an interview session


def should_advance_phase(db: Session, user_id: str, phase_id: int) -> bool:
    history_len = len(get_phase_messages(db, phase_id))

    return history_len > 15


def advance_to_next_phase(db: Session, user_id: str, phase_id):
    current_phase = get_phase_for_user(db, phase_id, user_id)
    current_phase_index = current_phase.order_index

    # Don't advance past Technical (final) phase
    if current_phase_index == len(PhaseType) - 1:
        return current_phase

    next_phase_index = (current_phase_index + 1) % len(PhaseType)
    return advance_phase_to_target(db, user_id, phase_id, next_phase_index)


def advance_phase_to_target(
    db: Session, user_id: str, phase_id: int, target_phase_index: int
) -> InterviewPhase:
    current_phase = get_phase_for_user(db, phase_id, user_id)  # Ownership check

    # Retrieve target phase from database
    statement = select(InterviewPhase).where(
        InterviewPhase.interview_id == current_phase.interview_id,
        InterviewPhase.order_index == target_phase_index,
    )
    target_phase = db.exec(statement).first()

    if not target_phase:
        raise HTTPException(
            status_code=404,
            detail=f"No phase with order index {target_phase_index} for this interview",
        )

    now = datetime.now(timezone.utc)

    # Begin phase transition, mark current phase as completed
    if (
        current_phase.id != target_phase.id
        and current_phase.order_index != target_phase_index
    ):
        current_phase.status = PhaseStatus.COMPLETED
        current_phase.completed_at = now
        db.add(current_phase)

    # Set target phase as active
    target_phase.status = PhaseStatus.IN_PROGRESS
    if not target_phase.started_at:
        target_phase.started_at = now

    db.add(target_phase)

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    db.refresh(target_phase)
    return target_phase


def _get_validated_coding_problem_for_phase(
    db: Session, user_id: str, phase_id: int
) -> CodingProblem:
    phase = get_phase_for_user(db, phase_id, user_id)  # Ownership check
    if not phase.coding_problem_id:
        raise HTTPException(
            status_code=404, detail="Phase found, but no coding problem assigned."
        )

    return get_coding_problem(db, phase.coding_problem_id)


def get_coding_problem_details_for_phase(
    db: Session, user_id: str, phase_id: int
) -> tuple[
    CodingProblem,
    list[ProblemExample],
    list[ProgrammingLanguage],
]:
    coding_problem = _get_validated_coding_problem_for_phase(db, user_id, phase_id)

    problem_examples = get_examples_for_problem(db, coding_problem.id)

    languages = get_available_languages_for_problem(db, coding_problem.id)

    return (coding_problem, problem_examples, languages)


def get_available_languages_for_phase(
    db: Session, user_id: str, phase_id: int
) -> list[ProgrammingLanguage]:
    coding_problem = _get_validated_coding_problem_for_phase(db, user_id, phase_id)
    return get_available_languages_for_problem(db, coding_problem.id)


def get_language_template_for_phase(
    db: Session, user_id: str, phase_id: int, language_id: int
) -> ProblemLanguageTemplate:
    problem = _get_validated_coding_problem_for_phase(db, user_id, phase_id)

    return get_language_template_for_problem(db, problem.id, language_id)
