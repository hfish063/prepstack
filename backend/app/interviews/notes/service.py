from sqlmodel import Session, select

from app.exceptions import ResourceNotFoundError
from app.interviews.sessions.models import InterviewSession
from app.interviews.notes.models import InterviewSessionNotes
from app.interviews.notes.schemas import (
    InterviewSessionNotesCreate,
    InterviewSessionNotesUpdate,
)


def get(db: Session, user_id: str, interview_id: int) -> InterviewSessionNotes | None:
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


def get_existing(db: Session, user_id: str, interview_id: int) -> InterviewSessionNotes:
    notes = get(db, user_id, interview_id)

    if not notes:
        raise ResourceNotFoundError("Interview notes with this id do not exist.")

    return notes


def save(
    db: Session, user_id: str, interview_id: int, notes: InterviewSessionNotesCreate
) -> InterviewSessionNotes:
    interview = db.exec(
        select(InterviewSession).where(
            InterviewSession.id == interview_id, InterviewSession.user_id == user_id
        )
    ).one_or_none()

    if not interview:
        raise ResourceNotFoundError("Interview session with this id does not exist.")

    interview_notes = InterviewSessionNotes(
        **notes.model_dump(), interview_id=interview_id
    )
    db.add(interview_notes)
    db.commit()
    db.refresh(interview_notes)

    return interview_notes


def update(
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


def delete(db: Session, user_id: str, interview_id: int) -> None:
    notes = get_existing(db, user_id, interview_id)

    db.delete(notes)
    db.commit()
