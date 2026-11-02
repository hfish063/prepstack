from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user
from app.db.database import get_db
from app.schemas.interview_phase import InterviewPhaseRead
from app.services.interview_phase_service import advance_phase_to_target

router = APIRouter(prefix="/phases")


@router.post("/{phase_id}/advance/{target_phase_index}", response_model=InterviewPhaseRead)
def advance_phase(
    phase_id: int,
    target_phase_index: int,
    db: Session = Depends(get_db),
    auth=Depends(get_current_user),
):
    user_id = auth.payload["sub"]
    return advance_phase_to_target(db, user_id, phase_id, target_phase_index)
