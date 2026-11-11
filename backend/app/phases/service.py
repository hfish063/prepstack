from datetime import datetime, timezone

from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import SQLAlchemyError

from app.enums import PhaseStatus, PhaseType
from app.interviews.models import InterviewSession
from app.phases.models import InterviewPhase


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
            coding_problem_id=10,
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
    db: Session, interview: InterviewSession
) -> list[InterviewPhase]:
    interview_id = interview.id
    return db.exec(
        select(InterviewPhase)
        .where(
            InterviewPhase.interview_id == interview_id,
        )
        .order_by(InterviewPhase.order_index)
    ).all()


def mark_phases_completed(
    db: Session, interview: InterviewSession
) -> list[InterviewPhase]:
    phases = get_phases_for_interview(db, interview)
    now = datetime.now(timezone.utc)

    for phase in phases:
        phase.status = PhaseStatus.COMPLETED

        if not phase.started_at:
            phase.started_at = now

        if not phase.completed_at:
            phase.completed_at = now

    db.add_all(phases)

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    for phase in phases:
        db.refresh(phase)

    return phases


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


def get_coding_problem_id_for_phase(db: Session, user_id: str, phase_id: int) -> int:
    phase = get_phase_for_user(db, phase_id, user_id)  # Ownership check
    if not phase.coding_problem_id:
        raise HTTPException(
            status_code=404, detail="Phase found, but no coding problem assigned."
        )

    return phase.coding_problem_id
