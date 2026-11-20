from sqlmodel import Session, select

from app.interviews.evaluations.schemas import InterviewSummaryCreate
from app.interviews.sessions.models import InterviewSession
from app.interviews.evaluations.models import InterviewSummary


def get_summary_by_interview(
    db: Session, interview: InterviewSession
) -> InterviewSummary | None:
    return db.exec(
        select(InterviewSummary).where(InterviewSummary.interview_id == interview.id)
    ).one_or_none()


def save_summary(db: Session, summary_create: InterviewSummaryCreate) -> InterviewSummary:
    summary = InterviewSummary(**summary_create.model_dump())
    try:
        db.add(summary_create)
        db.commit()
    except:
        db.rollback()
        raise

