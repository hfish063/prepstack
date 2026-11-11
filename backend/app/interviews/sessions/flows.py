from sqlmodel import Session

from app.interviews.sessions import service as interviews_service
from app.interviews.sessions.models import InterviewSession
from app.interviews.sessions.schemas import InterviewSessionCreate
from app.interviews.phases import service as phases_service


def create_interview_with_phases(
    db: Session, new_interview_session: InterviewSessionCreate, user_id: str
) -> InterviewSession:
    interview = interviews_service.save(db, new_interview_session, user_id)
    phases_service.create_interview_phases(db, interview.id)
    return interview


def complete_interview(db: Session, interview: InterviewSession) -> InterviewSession:
    phases_service.mark_phases_completed(db, interview)
    return interviews_service.mark_interview_complete(db, interview)
