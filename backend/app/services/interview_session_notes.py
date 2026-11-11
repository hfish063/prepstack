from sqlmodel import Session, select

from app.models.interview_session import InterviewSession
from app.models.interview_session_notes import InterviewSessionNotes
from app.schemas.interview_session_notes import (
    InterviewSessionNotesCreate,
    InterviewSessionNotesUpdate,
)


def get_notes_for_interview(
    db: Session, user_id: str, interview_id: int
) -> InterviewSessionNotes | None:
    return db.exec(
        select(InterviewSessionNotes)
        .join(
            InterviewSession, InterviewSession.id == InterviewSessionNotes.interview_id
        )
        .where(
            InterviewSessionNotes.interview_id == interview_id,
            InterviewSession.user_id == user_id,
        )
    ).one_or_none()


def save_notes_for_interview(
    db: Session, user_id: str, interview_id: int, notes: InterviewSessionNotesCreate
) -> InterviewSessionNotes:
    interview = db.exec(
        select(InterviewSession).where(
            InterviewSession.id == interview_id, InterviewSession.user_id == user_id
        )
    ).one_or_none()

    if not interview:
        raise ValueError("Interview does not exist")

    interview_notes = InterviewSessionNotes(
        **notes.model_dump(), interview_id=interview_id
    )
    db.add(interview_notes)
    db.commit()
    db.refresh(interview_notes)

    return interview_notes


def update_notes_for_interview(
    db: Session,
    notes: InterviewSessionNotes,
    notes_update: InterviewSessionNotesUpdate,
) -> InterviewSessionNotes:
    update_data = notes_update.model_dump(exclude_unset=True)
    notes.sqlmodel_update(update_data)

    db.add(notes)
    db.commit()
    db.refresh(notes)

    return notes


def delete_notes_for_interview(db: Session, user_id: str, interview_id) -> None:
    notes = db.exec(
        select(InterviewSessionNotes)
        .join(
            InterviewSession, InterviewSession.id == InterviewSessionNotes.interview_id
        )
        .where(
            InterviewSession.user_id == user_id,
            InterviewSessionNotes.interview_id == interview_id,
        )
    ).one_or_none()

    db.delete(notes)
    db.commit()
