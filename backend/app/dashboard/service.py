from clerk_backend_api import Session
from sqlmodel import func, select

from app.dashboard.schemas import DashboardSummaryRead
from app.enums import InterviewStatus, MessageKind, MessageRole
from app.interviews.phases.models import InterviewPhase
from app.interviews.sessions.models import InterviewSession
from app.messages.models import Message
from app.submissions.models import ProblemSubmission


def get(db: Session, user_id: str) -> DashboardSummaryRead:
    interviews_count = _count_interviews(db, user_id)
    completed_interviews_count = _count_completed_interviews(db, user_id)
    messages_sent = _count_messages_sent(db, user_id)
    hints_used = _count_hints(db, user_id)
    submissions_accepted = _count_accepted_submissions(db, user_id)

    return DashboardSummaryRead(
        interviews_created=interviews_count,
        interviews_completed=completed_interviews_count,
        messages_sent=messages_sent,
        hints_used=hints_used,
        submissions_accepted=submissions_accepted,
    )


def _count_interviews(db: Session, user_id: str) -> int:
    return db.exec(
        select(func.count())
        .select_from(InterviewSession)
        .where(InterviewSession.user_id == user_id)
    ).one()


def _count_completed_interviews(db: Session, user_id: str) -> int:
    return db.exec(
        select(func.count())
        .select_from(InterviewSession)
        .where(
            InterviewSession.user_id == user_id, InterviewSession.status == InterviewStatus.COMPLETED
        )
    ).one()


def _count_messages_sent(db: Session, user_id: str) -> int:
    return db.exec(
        select(func.count())
        .select_from(Message)
        .join(InterviewPhase, Message.phase_id == InterviewPhase.id)
        .join(InterviewSession, InterviewSession.id == InterviewPhase.interview_id)
        .where(InterviewSession.user_id == user_id, Message.role == MessageRole.USER)
    ).one()


def _count_hints(db: Session, user_id: str) -> int:
    return db.exec(
        select(func.count())
        .select_from(Message)
        .join(InterviewPhase, Message.phase_id == InterviewPhase.id)
        .join(InterviewSession, InterviewSession.id == InterviewPhase.interview_id)
        .where(InterviewSession.user_id == user_id, Message.kind == MessageKind.HINT)
    ).one()


def _count_accepted_submissions(db: Session, user_id: str) -> int:
    return db.exec(
        select(func.count())
        .select_from(ProblemSubmission)
        .where(ProblemSubmission.accepted, ProblemSubmission.user_id == user_id)
    ).one()
