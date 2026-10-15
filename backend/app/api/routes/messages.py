from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user
from app.db.database import get_db
from app.schemas.message import MessageCreate, MessageRead
from app.services.interview_service import process_message
from app.services.message_service import get_phase_messages

router = APIRouter(prefix="/messages")


@router.post("/send/{phase_id}", response_model=MessageRead)
def send_message(
    phase_id: int,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    auth=Depends(get_current_user),
):
    user_id = auth.payload["sub"]

    return process_message(db, phase_id, user_id, payload.content)


@router.post("/messages/{phase_id}", response_model=list[MessageRead])
def find_phase_Messages(
    phase_id: int, db: Session = Depends(get_db), auth=Depends(get_current_user)
):
    return get_phase_messages(db, phase_id)
