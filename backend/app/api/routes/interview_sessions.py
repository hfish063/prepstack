from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.auth.clerk import get_current_user, get_current_user_id
from app.schemas.interview_phase import InterviewPhaseRead
from app.schemas.interview_session import InterviewSessionCreate, InterviewSessionRead
from app.db.database import get_db
from app.schemas.interview_session_notes import (
    InterviewSessionNotesCreate,
    InterviewSessionNotesRead,
    InterviewSessionNotesUpdate,
)
from app.services.interview_phase import get_phases_for_interview
from app.services.interview_session import (
    create_user_interview,
    get_all_user_interviews,
    get_user_interview_by_id,
    delete_user_interview_by_id,
    mark_interview_complete,
)
from app.services.interview_session_notes import (
    delete_notes_for_interview,
    get_notes_for_interview,
    save_notes_for_interview,
    update_notes_for_interview,
)

router = APIRouter(prefix="/interviews")


@router.get("/all", response_model=list[InterviewSessionRead])
def find_all_interview_sessions(
    db: Session = Depends(get_db), auth=Depends(get_current_user)
):
    user_id = auth.payload["sub"]
    return get_all_user_interviews(db, user_id)


@router.post(
    "/save", response_model=InterviewSessionRead, status_code=status.HTTP_201_CREATED
)
def save_interview_session(
    new_interview_session: InterviewSessionCreate,
    db: Session = Depends(get_db),
    auth=Depends(get_current_user),
):
    user_id = auth.payload["sub"]
    return create_user_interview(db, new_interview_session, user_id)


@router.delete("/delete/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview_session(
    interview_id: int, db: Session = Depends(get_db), auth=Depends(get_current_user)
):
    user_id = auth.payload["sub"]
    delete_user_interview_by_id(db, user_id, interview_id)


@router.get("/{interview_id}", response_model=InterviewSessionRead)
def find_interview_session(
    interview_id: int, db: Session = Depends(get_db), auth=Depends(get_current_user)
):
    user_id = auth.payload["sub"]
    return get_user_interview_by_id(db, user_id, interview_id)


@router.get("/{interview_id}/phases", response_model=list[InterviewPhaseRead])
def find_phases_for_interview(
    interview_id: int, db: Session = Depends(get_db), auth=Depends(get_current_user)
):
    user_id = auth.payload["sub"]
    return get_phases_for_interview(db, user_id, interview_id)


@router.post("/{interview_id}/complete", response_model=InterviewSessionRead)
def complete_interview_session(
    interview_id: int, db: Session = Depends(get_db), auth=Depends(get_current_user)
):
    user_id = auth.payload["sub"]
    return mark_interview_complete(db, user_id, interview_id)


@router.get("/{interview_id}/notes", response_model=InterviewSessionNotesRead)
def get_interview_notes(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    notes = get_notes_for_interview(db, user_id, interview_id)
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
        return save_notes_for_interview(db, user_id, interview_id, notes)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{interview_id}/notes/update", response_model=InterviewSessionNotesRead)
def update_interview_notes(
    interview_id: int,
    notes_update: InterviewSessionNotesUpdate,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    notes = get_notes_for_interview(db, user_id, interview_id)
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview notes with this id do not exist.",
        )

    return update_notes_for_interview(db, notes, notes_update)


@router.delete("/{interview_id}/notes/delete", response_model=None)
def delete_interview_notes(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    notes = get_notes_for_interview(db, user_id, interview_id)
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview notes with this id do not exist.",
        )

    delete_notes_for_interview(db, user_id, interview_id)
