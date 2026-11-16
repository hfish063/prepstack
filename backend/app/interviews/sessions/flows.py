from sqlmodel import Session

from app.interviews.sessions import service as interviews_service
from app.interviews.sessions.models import InterviewSession
from app.interviews.sessions.schemas import InterviewSessionCreate
from app.interviews.phases import service as phases_service
from app.questions import service as questions_service
from app.questions import flows as questions_flows
from app.questions.flows import supports_questions


def create_interview_with_phases(
    db: Session, new_interview_session: InterviewSessionCreate, user_id: str
) -> InterviewSession:
    """Creates an interview session and corresponding dependencies.

    1. Create interview phases
    2. Generate question set for each phase

    These items are persisted sequentially.

    If generation fails, cleanup and delete the interview.
    """
    interview = interviews_service.save(db, new_interview_session, user_id)
    phases = phases_service.create_interview_phases(db, interview.id)

    for phase in phases:
        if supports_questions(phase):
            try:
                questions = questions_flows.generate_questions(phase)
                questions_service.save_all(db, phase, questions)
            except Exception:
                interviews_service.delete(db, interview)
                raise

    return interview


def complete_interview(db: Session, interview: InterviewSession) -> InterviewSession:
    """Marks interview and related phases as completed in the database."""
    phases_service.mark_phases_completed(db, interview)
    return interviews_service.mark_interview_complete(db, interview)
