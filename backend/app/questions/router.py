from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from starlette import status

from app.auth.clerk import get_current_user_id
from app.database.database import get_db
from app.interviews.phases.service import get_phase_for_user
from app.questions import service as question_service

router = APIRouter(prefix="/questions")


@router.get("/{phase_id}/{question_id}")
def get_question_for_phase(
    phase_id: int,
    question_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    phase = get_phase_for_user(db, phase_id, user_id)

    if not phase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find phase for user.",
        )

    return question_service.get(db, phase, question_id)


@router.get("/{phase_Id}/all")
def get_questions_for_phase(
    phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    phase = get_phase_for_user(db, phase_id, user_id)

    if not phase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find phase for user.",
        )

    return question_service.get_all(db, phase)
