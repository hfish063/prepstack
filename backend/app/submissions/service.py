from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, delete, select

from app.coding_problems.exceptions import InvalidPhaseTypeError
from app.enums import PhaseType
from app.interviews.phases.models import InterviewPhase
from app.submissions.models import ProblemSubmission
from app.submissions.schemas import (
    ProblemSubmissionCreate,
    SubmissionAttemptRead,
    SubmissionStatsRead,
)

MAX_ATTEMPTS_SHOWN = 20


def get_all_submissions(db: Session, phase: InterviewPhase) -> list[ProblemSubmission]:
    if phase.phase_type != PhaseType.TECHNICAL:
        raise InvalidPhaseTypeError(
            "This interview phase does not support code execution."
        )

    return db.exec(
        select(ProblemSubmission)
        .where(ProblemSubmission.phase_id == phase.id)
        .order_by(ProblemSubmission.created_at, ProblemSubmission.id)
    ).all()


def get_submission_stats(db: Session, phase: InterviewPhase) -> SubmissionStatsRead:
    submissions = get_all_submissions(db, phase)

    attempts = [
        SubmissionAttemptRead(attempt_number=number, **submission.model_dump())
        for number, submission in enumerate(submissions, start=1)
    ]

    accepted_on_attempt = None
    for attempt in attempts:
        if attempt.accepted:
            accepted_on_attempt = attempt.attempt_number
            break

    return SubmissionStatsRead(
        attempt_count=len(attempts),
        accepted_on_attempt=accepted_on_attempt,
        attempts=attempts[-MAX_ATTEMPTS_SHOWN:],
    )


def create_submission(
    db: Session, user_id: str, submission_create: ProblemSubmissionCreate
) -> ProblemSubmission:
    submission = ProblemSubmission(user_id=user_id, **submission_create.model_dump())

    try:
        db.add(submission)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise

    db.refresh(submission)
    return submission


def delete_all_submissions(db: Session, phase: InterviewPhase) -> None:
    if phase.phase_type != PhaseType.TECHNICAL:
        raise InvalidPhaseTypeError("Submissions do not exist for this interview type.")

    statement = delete(ProblemSubmission).where(ProblemSubmission.phase_id == phase.id)

    try:
        db.exec(statement)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise
