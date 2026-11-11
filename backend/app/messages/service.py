from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select

from app.enums import MessageRole
from app.interviews.phases.models import InterviewPhase
from app.messages.models import Message


def save(db: Session, phase_id: int, role: MessageRole, content: str) -> Message:
    db_message = Message(phase_id=phase_id, role=role, content=content)

    try:
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
    except SQLAlchemyError:
        db.rollback()
        raise

    return db_message


def get_all_by_phase(db: Session, phase: InterviewPhase) -> list[Message]:
    phase_id = phase.id
    statement = select(Message).where(Message.phase_id == phase_id)
    return db.exec(statement).all()
