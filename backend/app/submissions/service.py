from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select

from app.coding_problems.exceptions import InvalidPhaseTypeError
from app.enums import PhaseType
from app.interviews.phases.models import InterviewPhase
from app.submissions.models import ProblemSubmission


def get_all_submissions(db: Session, phase: InterviewPhase) -> list[ProblemSubmission]:
    if phase.phase_type != PhaseType.TECHNICAL:
        raise InvalidPhaseTypeError(
            "This interview phase does not support code execution."
        )

    return db.exec(
        select(ProblemSubmission)
        .where(ProblemSubmission.phase_id == phase.id)
        .order_by(ProblemSubmission.created_at)
    ).all()


def create_submission(
    db: Session,
    user_id: str,
    problem_id: int,
    language_id: int,
    phase_id: int,
    source_code: str,
    accepted: bool,
) -> ProblemSubmission:
    submission = ProblemSubmission(
        user_id=user_id,
        problem_id=problem_id,
        language_id=language_id,
        phase_id=phase_id,
        source_code=source_code,
        accepted=accepted,
    )

    db.add(submission)

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    db.refresh(submission)
    return submission
