from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from starlette import status

from app.auth.clerk import get_current_user_id
from app.db.database import get_db
from app.interviews.notes.service import get, save, update, delete
from app.interviews.notes.schemas import (
    InterviewSessionNotesCreate,
    InterviewSessionNotesRead,
    InterviewSessionNotesUpdate,
)

router = APIRouter()


@router.get("/{interview_id}/notes", response_model=InterviewSessionNotesRead)
def get_interview_notes(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    notes = get(db, user_id, interview_id)
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview notes with this id do not exist.",
        )

    return notes


@router.post("/{interview_id}/notes/save", response_model=InterviewSessionNotesRead)
def save_interview_notes(
    interview_id: int,
    notes: InterviewSessionNotesCreate,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    try:
        return save(db, user_id, interview_id, notes)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{interview_id}/notes/update", response_model=InterviewSessionNotesRead)
def update_interview_notes(
    interview_id: int,
    notes_update: InterviewSessionNotesUpdate,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    notes = get(db, user_id, interview_id)
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview notes with this id do not exist.",
        )

    return update(db, notes, notes_update)


@router.delete("/{interview_id}/notes/delete", response_model=None)
def delete_interview_notes(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    notes = get(db, user_id, interview_id)
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview notes with this id do not exist.",
        )

    delete(db, user_id, interview_id)
