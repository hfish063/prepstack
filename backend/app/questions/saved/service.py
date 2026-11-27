from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select

from app.exceptions import ResourceNotFoundError
from app.questions.saved.models import SavedQuestion
from app.questions.saved.schemas import SavedQuestionCreate


def get(db: Session, saved_question_id: int, user_id: str) -> SavedQuestion:
    saved_question = db.exec(
        select(SavedQuestion).where(
            SavedQuestion.id == saved_question_id, SavedQuestion.user_id == user_id
        )
    ).one_or_none()

    if not saved_question:
        raise ResourceNotFoundError("Saved question with this id does not exist.")

    return saved_question


def save(
    db: Session, saved_question_create: SavedQuestionCreate, user_id: str
) -> SavedQuestion:
    question = SavedQuestion(**saved_question_create.model_dump(), user_id=user_id)

    try:
        db.add(question)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    return question


def delete(db: Session, saved_question: SavedQuestion) -> None:
    try:
        db.delete(saved_question)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise
