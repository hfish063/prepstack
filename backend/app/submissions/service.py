from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session

from app.submissions.models import ProblemSubmission


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
