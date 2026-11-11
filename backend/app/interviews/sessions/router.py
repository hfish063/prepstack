from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.auth.clerk import get_current_user_id
from app.database.database import get_db
from app.interviews.sessions.flows import (
    complete_interview,
    create_interview_with_phases,
)
from app.interviews.notes.router import router as notes_router
from app.interviews.sessions.schemas import InterviewSessionCreate, InterviewSessionRead
from app.interviews.sessions.service import (
    delete,
    get_all,
    get,
)
from app.interviews.phases.schemas import InterviewPhaseRead
from app.interviews.phases.service import get_phases_for_interview

router = APIRouter(prefix="/interviews")
router.include_router(notes_router)


@router.get("/all", response_model=list[InterviewSessionRead])
def find_all_interview_sessions(
    db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    return get_all(db, user_id)


@router.get("/{interview_id}", response_model=InterviewSessionRead)
def find_interview_session(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    interview = get(db, user_id, interview_id)
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session with this id does not exist.",
        )

    return interview


@router.post(
    "/save", response_model=InterviewSessionRead, status_code=status.HTTP_201_CREATED
)
def save_interview_session(
    interview_create: InterviewSessionCreate,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    return create_interview_with_phases(db, interview_create, user_id)


@router.delete("/delete/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview_session(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    interview = get(db, user_id, interview_id)
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session with this id does not exist.",
        )

    delete(db, interview)


@router.get("/{interview_id}/phases", response_model=list[InterviewPhaseRead])
def find_phases_for_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    interview = get(db, user_id, interview_id)
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session with this id does not exist.",
        )

    return get_phases_for_interview(db, interview)


@router.post("/{interview_id}/complete", response_model=InterviewSessionRead)
def complete_interview_session(
    interview_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    interview = get(db, user_id, interview_id)
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview session with this id does not exist.",
        )

    return complete_interview(db, interview)
