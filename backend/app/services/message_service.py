from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select

from app.enums import MessageRole
from app.models.message import Message


def save_message(
    db: Session, phase_id: int, role: MessageRole, content: str
) -> Message:
    db_message = Message(phase_id=phase_id, role=role, content=content)

    try:
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
    except SQLAlchemyError:
        db.rollback()
        raise

    return db_message


def get_phase_messages(db: Session, phase_id: int) -> list[Message]:
    statement = select(Message).where(Message.phase_id == phase_id)
    return db.exec(statement).all()
