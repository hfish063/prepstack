from sqlmodel import Session, select
from sqlalchemy.exc import SQLAlchemyError

from app.models.interview_session import InterviewSession
from app.schemas.interview_session import InterviewSessionCreate


def get_all_user_interviews(db: Session, user_id: str) -> list[InterviewSession]:
    statement = select(InterviewSession).where(InterviewSession.user_id == user_id)
    return db.exec(statement).all()

def get_user_interview_by_id(db: Session, user_id: str, interview_id: int) -> InterviewSession:
    statement = select(InterviewSession).where(InterviewSession.user_id == user_id, InterviewSession.id == interview_id)
    return db.exec(statement).first()

def create_user_interview(db: Session, new_interview_session: InterviewSessionCreate, user_id: str) -> InterviewSession:
    db_session = InterviewSession(**new_interview_session.model_dump(), user_id=user_id)

    try:
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        return db_session
    except SQLAlchemyError:
        db.rollback()
        raise

def delete_user_interview_by_id(db: Session, user_id: str, interview_id: int) -> None:
    interview = get_user_interview_by_id(db, user_id, interview_id)
    if not interview:
        return

    try:
        db.delete(interview)
        db.commit()
        return
    except SQLAlchemyError:
        db.rollback()
        raise