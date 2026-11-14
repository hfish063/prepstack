from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select

from app.exceptions import ResourceNotFoundError
from app.interviews.phases.models import InterviewPhase
from app.questions.models import InterviewQuestion
from app.questions.schemas import InterviewQuestionCreate


def get(db: Session, phase: InterviewPhase, question_id: int):
    question = db.exec(
        select(InterviewQuestion).where(
            InterviewQuestion.id == question_id, InterviewQuestion.phase_id == phase.id,
        )
    ).one_or_none()

    if not question:
        raise ResourceNotFoundError("No interview questions with this id were found.")

    return question


def get_all(db: Session, phase: InterviewPhase) -> list[InterviewQuestion]:
    return db.exec(
        select(InterviewQuestion).where(InterviewQuestion.phase_id == phase.id)
    ).all()


def save(
    db: Session, phase: InterviewPhase, question_create: InterviewQuestionCreate
) -> InterviewQuestion:
    question = InterviewQuestion(**question_create.model_dump(), phase_id=phase.id)

    try:
        db.add(question)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    return question


def save_all(
    db: Session, phase: InterviewPhase, questions_create: list[InterviewQuestionCreate]
) -> list[InterviewQuestion]:
    questions = [
        InterviewQuestion(**question.model_dump(), phase_id=phase.id)
        for question in questions_create
    ]

    try:
        db.add_all(questions)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    return questions
