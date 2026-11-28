from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select

from app.exceptions import ResourceNotFoundError
from app.questions.saved.models import SavedQuestion, SavedQuestionTag
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


def get_all(db: Session, user_id: str) -> list[SavedQuestion]:
    return db.exec(select(SavedQuestion).where(SavedQuestion.user_id == user_id)).all()


def save(
    db: Session, saved_question_create: SavedQuestionCreate, user_id: str
) -> SavedQuestion:
    question = SavedQuestion(
        **saved_question_create.model_dump(exclude={"tags"}),
        user_id=user_id,
        tags=[
            SavedQuestionTag(content=tag.content)
            for tag in saved_question_create.tags or []
        ]
    )

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
