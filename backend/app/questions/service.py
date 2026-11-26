from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, func, select

from app.enums import InterviewStatus
from app.exceptions import ResourceConflictError, ResourceNotFoundError
from app.interviews.phases.models import InterviewPhase
from app.interviews.sessions.models import InterviewSession
from app.questions.models import InterviewQuestion
from app.questions.schemas import InterviewQuestionCreate


def get(db: Session, phase: InterviewPhase, question_id: int):
    question = db.exec(
        select(InterviewQuestion).where(
            InterviewQuestion.id == question_id,
            InterviewQuestion.phase_id == phase.id,
        )
    ).one_or_none()

    if not question:
        raise ResourceNotFoundError("No interview questions with this id were found.")

    return question


def get_all(db: Session, phase: InterviewPhase) -> list[InterviewQuestion]:
    return db.exec(
        select(InterviewQuestion)
        .where(InterviewQuestion.phase_id == phase.id)
        .order_by(InterviewQuestion.ordinal)
    ).all()


def get_for_user(db: Session, question_id: int, user_id: str) -> InterviewQuestion:
    """Gets interview question that belongs to provided user."""
    question = db.exec(
        select(InterviewQuestion)
        .join(InterviewPhase, InterviewQuestion.phase_id == InterviewPhase.id)
        .join(InterviewSession, InterviewSession.id == InterviewPhase.interview_id)
        .where(InterviewQuestion.id == question_id, InterviewSession.user_id == user_id)
    ).one_or_none()

    if not question:
        raise ResourceNotFoundError(
            "No interview questions with this id were found for user."
        )

    return question


def get_mutable_for_user(
    db: Session, question_id: int, user_id: str
) -> InterviewQuestion:
    """Get a mutable question that belongs to provided user.

    Mutability depends on the parent InterviewSession, and status not being COMPLETED.
    Completed interview sessions can no longer be modified.
    """
    row = db.exec(
        select(InterviewQuestion, InterviewSession.status)
        .join(InterviewPhase, InterviewQuestion.phase_id == InterviewPhase.id)
        .join(InterviewSession, InterviewPhase.interview_id == InterviewSession.id)
        .where(InterviewQuestion.id == question_id, InterviewSession.user_id == user_id)
    ).one_or_none()

    if not row:
        raise ResourceNotFoundError(
            "No interview questions with this id were found for user."
        )

    question, interview_status = row

    if interview_status == InterviewStatus.COMPLETED:
        raise ResourceConflictError(
            "This interview has already been completed and can no longer be modified."
        )

    return question


def get_count_for_interview(db: Session, interview_id: int) -> int:
    return db.exec(
        select(func.count(InterviewQuestion.id))
        .join(InterviewPhase, InterviewQuestion.phase_id == InterviewPhase.id)
        .where(InterviewPhase.interview_id == interview_id)
    ).one()


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
