from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from starlette import status

from app.exceptions import ResourceConflictError
from app.auth.clerk import get_current_user_id
from app.database.database import get_db
from app.messages.flows import process_message
from app.messages.schemas import MessageCreate, MessageRead
from app.messages.service import get_all_by_phase
from app.interviews.phases.service import get_phase_for_user, get_mutable_phase_for_user

router = APIRouter(prefix="/messages")


@router.post("/send/{phase_id}", response_model=MessageRead)
def send_message(
    phase_id: int,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    phase = get_mutable_phase_for_user(
        db, phase_id, user_id
    )  # Ownership check, raises 404

    return process_message(db, phase, user_id, payload.content)


@router.get("/{phase_id}", response_model=list[MessageRead])
def find_all_phase_messages(
    phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    phase = get_phase_for_user(db, phase_id, user_id)  # Ownership check, raises 404
    return get_all_by_phase(db, phase)
