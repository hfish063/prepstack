from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user_id
from app.database.database import get_db
from app.interviews.notes.service import delete, get, get_existing, save, update
from app.interviews.notes.schemas import (
    InterviewSessionNotesCreate,
    InterviewSessionNotesRead,
    InterviewSessionNotesUpdate,
)

router = APIRouter()


@router.get("/{interview_id}/notes", response_model=InterviewSessionNotesRead | None)
def get_interview_notes(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    return get(db, user_id, interview_id)


@router.post("/{interview_id}/notes/save", response_model=InterviewSessionNotesRead)
def save_interview_notes(
    interview_id: int,
    notes: InterviewSessionNotesCreate,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    return save(db, user_id, interview_id, notes)


@router.put("/{interview_id}/notes/update", response_model=InterviewSessionNotesRead)
def update_interview_notes(
    interview_id: int,
    notes_update: InterviewSessionNotesUpdate,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    notes = get_existing(db, user_id, interview_id)

    return update(db, notes, notes_update)


@router.delete("/{interview_id}/notes/delete", response_model=None)
def delete_interview_notes(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    delete(db, user_id, interview_id)
