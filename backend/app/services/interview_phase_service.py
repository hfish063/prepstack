from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import SQLAlchemyError

from app.enums import MessageRole, PhaseStatus, PhaseType
from app.models.interview_phase import InterviewPhase
from app.models.interview_session import InterviewSession


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


def get_phase_for_user(db: Session, phase_id: int, role: MessageRole, user_id: str):
    statement = (
        select(InterviewPhase)
        .join(InterviewSession, InterviewPhase.id == InterviewSession.id)
        .where(InterviewPhase.phase_id == phase_id, InterviewSession.user_id == user_id)
    )
    phase = db.exec(statement).first()

    if not phase:
        raise HTTPException(status_code=404, detail="Interview phase not found")

    return phase
