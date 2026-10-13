from sqlmodel import Session
from sqlalchemy.exc import SQLAlchemyError

from app.enums import PhaseStatus, PhaseType
from app.models.interview_phase import InterviewPhase


def create_interview_phases(db: Session, interview_id: int, ):
    phases = [InterviewPhase(interview_id=interview_id, phase_type=PhaseType.BEHAVIORAL, order_index=0, status=PhaseStatus.IN_PROGRESS),
              InterviewPhase(interview_id=interview_id, phase_type=PhaseType.CONCEPTUAL, order_index=1, status=PhaseStatus.PENDING),
              InterviewPhase(interview_id=interview_id, phase_type=PhaseType.TECHNICAL, order_index=2, status=PhaseStatus.PENDING)]

    try:
        db.add_all(phases)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise