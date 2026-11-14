from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from starlette import status

from app.auth.clerk import get_current_user_id
from app.database.database import get_db
from app.interviews.phases.schemas import InterviewPhaseRead
from app.interviews.phases.service import (
    advance_phase_to_target,
    get_mutable_phase_for_user,
)

router = APIRouter(prefix="/phases")


@router.post(
    "/{phase_id}/advance/{target_phase_index}", response_model=InterviewPhaseRead
)
def advance_phase(
    phase_id: int,
    target_phase_index: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    current_phase = get_mutable_phase_for_user(db, phase_id, user_id)
    if not current_phase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find current phase for user.",
        )

    return advance_phase_to_target(db, user_id, current_phase, target_phase_index)
