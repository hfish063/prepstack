from datetime import datetime, timezone

from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import SQLAlchemyError

from app.enums import InterviewStatus, PhaseStatus
from app.models.interview_phase import InterviewPhase
from app.models.interview_session import InterviewSession
from app.schemas.interview_session import InterviewSessionCreate
from app.services.interview_phase_service import create_interview_phases, get_phases_for_interview


def get_all_user_interviews(db: Session, user_id: str) -> list[InterviewSession]:
    statement = select(InterviewSession).where(InterviewSession.user_id == user_id)
    return db.exec(statement).all()


def get_user_interview_by_id(
    db: Session, user_id: str, interview_id: int
) -> InterviewSession:
    statement = select(InterviewSession).where(
        InterviewSession.user_id == user_id, InterviewSession.id == interview_id
    )
    interview = db.exec(statement).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")

    return interview


def create_user_interview(
    db: Session, new_interview_session: InterviewSessionCreate, user_id: str
) -> InterviewSession:
    db_session = InterviewSession(**new_interview_session.model_dump(), user_id=user_id)

    try:
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    except SQLAlchemyError:
        db.rollback()
        raise

    create_interview_phases(db, db_session.id)
    return db_session


def delete_user_interview_by_id(db: Session, user_id: str, interview_id: int) -> None:
    interview = get_user_interview_by_id(db, user_id, interview_id)
    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Failed to locate interview session with corresponding id.",
        )

    try:
        db.delete(interview)
        db.commit()
        return
    except SQLAlchemyError:
        db.rollback()
        raise

def mark_interview_complete(db: Session, user_id: str, interview_id: int) -> InterviewSession:
    interview = get_user_interview_by_id(db, user_id, interview_id)
    _mark_phases_complete(db, user_id, interview_id)

    interview.status = InterviewStatus.COMPLETED

    try:
        db.add(interview)
        db.commit()
        db.refresh(interview)
    except SQLAlchemyError:
        db.rollback()
        raise

    return interview

def _mark_phases_complete(db: Session, user_id: str, interview_id: int) -> list[InterviewPhase]:
    phases = get_phases_for_interview(db, user_id, interview_id)
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
