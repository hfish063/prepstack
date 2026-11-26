from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.auth.clerk import get_current_user_id
from app.database.database import get_db
from app.interviews.phases.schemas import InterviewPhaseRead
from app.interviews.phases import service as phase_service
from app.messages.schemas import MessageRead
from app.messages import service as message_service

router = APIRouter(prefix="/phases")


@router.get("/{phase_id}/messages", response_model=list[MessageRead])
def find_messages_for_phase(phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)):
    phase = phase_service.get_phase_for_user(db, phase_id, user_id)

    return message_service.get_all_by_phase(db, phase)

@router.post(
    "/{phase_id}/advance/{target_phase_index}", response_model=InterviewPhaseRead
)
def advance_phase(
    phase_id: int,
    target_phase_index: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    current_phase = phase_service.get_mutable_phase_for_user(db, phase_id, user_id)

    return phase_service.advance_phase_to_target(db, user_id, current_phase, target_phase_index)
