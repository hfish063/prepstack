from sqlmodel import Session

from app.interviews.sessions.models import InterviewSession
from app.interviews.evaluations.models import InterviewSummary


def get_summaries_by_interview(
    db: Session, interview: InterviewSession
) -> InterviewSummary:
    pass
