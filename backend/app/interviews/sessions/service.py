from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select

from app.enums import InterviewStatus
from app.interviews.sessions.models import InterviewSession
from app.interviews.sessions.schemas import InterviewSessionCreate


def mark_interview_complete(
    db: Session, interview: InterviewSession
) -> InterviewSession:
    interview.status = InterviewStatus.COMPLETED

    try:
        db.add(interview)
        db.commit()
        db.refresh(interview)
    except SQLAlchemyError:
        db.rollback()
        raise

    return interview


def get_all(db: Session, user_id: str) -> list[InterviewSession]:
    statement = select(InterviewSession).where(InterviewSession.user_id == user_id)
    return db.exec(statement).all()


def get(db: Session, user_id: str, interview_id: int) -> InterviewSession | None:
    return db.exec(
        select(InterviewSession).where(
            InterviewSession.id == interview_id, InterviewSession.user_id == user_id
        )
    ).one_or_none()


def save(
    db: Session, interview_create: InterviewSessionCreate, user_id: str
) -> InterviewSession:
    interview = InterviewSession(**interview_create.model_dump(), user_id=user_id)

    try:
        db.add(interview)
        db.commit()
        db.refresh(interview)
    except SQLAlchemyError:
        db.rollback()
        raise

    return interview


def delete(db: Session, interview: InterviewSession) -> None:
    try:
        db.delete(interview)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise
