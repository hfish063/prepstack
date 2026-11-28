from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlmodel import Session, select

from app.exceptions import ResourceConflictError, ResourceNotFoundError
from app.questions.saved.models import (
    SavedQuestion,
    SavedQuestionAnalysis,
    SavedQuestionAnalysisFollowUp,
    SavedQuestionAnalysisTip,
    SavedQuestionTag,
)
from app.questions.saved.schemas import (
    SavedQuestionAnalysisCreate,
    SavedQuestionCreate,
)


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
    except IntegrityError as e:
        db.rollback()
        raise ResourceConflictError("This question has already been saved.") from e
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


def get_analysis(
    db: Session, saved_question: SavedQuestion
) -> SavedQuestionAnalysis | None:
    return db.exec(
        select(SavedQuestionAnalysis).where(
            SavedQuestionAnalysis.saved_question_id == saved_question.id
        )
    ).one_or_none()


def save_analysis(
    db: Session,
    saved_question: SavedQuestion,
    analysis_create: SavedQuestionAnalysisCreate,
) -> SavedQuestionAnalysis:
    analysis = SavedQuestionAnalysis(
        saved_question_id=saved_question.id,
        example_response=analysis_create.example_response,
        follow_ups=[
            SavedQuestionAnalysisFollowUp(content=content)
            for content in analysis_create.follow_ups
        ],
        tips=[
            SavedQuestionAnalysisTip(content=content)
            for content in analysis_create.tips
        ],
    )

    try:
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
    except SQLAlchemyError:
        db.rollback()
        raise

    return analysis
