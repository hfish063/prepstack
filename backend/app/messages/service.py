from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select

from app.enums import MessageKind, MessageRole
from app.interviews.phases.models import InterviewPhase
from app.messages.models import Message
from app.questions.models import InterviewQuestion


def save(
    db: Session,
    phase_id: int,
    question_id: int,
    role: MessageRole,
    kind: MessageKind,
    content: str,
) -> Message:
    db_message = Message(
        phase_id=phase_id,
        question_id=question_id,
        role=role,
        kind=kind,
        content=content,
    )

    try:
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
    except SQLAlchemyError:
        db.rollback()
        raise

    return db_message


def get_all_by_interview(db: Session, interview_id: int) -> list[Message]:
    return db.exec(
        select(Message)
        .join(InterviewPhase, Message.phase_id == InterviewPhase.id)
        .where(InterviewPhase.interview_id == interview_id)
        .order_by(Message.created_at, Message.id)
    ).all()


def get_all_by_phase(db: Session, phase: InterviewPhase) -> list[Message]:
    phase_id = phase.id
    statement = (
        select(Message)
        .where(Message.phase_id == phase_id)
        .order_by(Message.created_at, Message.id)
    )
    return db.exec(statement).all()


def get_all_by_question(db: Session, question: InterviewQuestion) -> list[Message]:
    statement = (
        select(Message)
        .where(Message.question_id == question.id)
        .order_by(Message.created_at, Message.id)
    )
    return db.exec(statement).all()


def get_message_stats(db: Session, interview_id: int) -> tuple[int, int, int]:
    """Retrieves the number of questions answered, user message count, and number of hints used
    for an interview.

    Returns a tuple with elements ordered as (questions answered, user message count, hints used)
    """
    messages = get_all_by_interview(db, interview_id)

    question_ids = set()

    message_count = 0

    hints_used = 0

    for message in messages:
        if message.role == MessageRole.USER:
            question_ids.add(message.question_id)
            message_count += 1
        elif message.kind == MessageKind.HINT:
            hints_used += 1

    return (len(question_ids), message_count, hints_used)
