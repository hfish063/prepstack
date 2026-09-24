from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user
from app.db.database import get_db


router = APIRouter(prefix="/messages")

@router.post("/{interview_id}")
def send_message(session_id: int, db: Session = Depends(get_db), auth = Depends(get_current_user)):
    # Verify user
    # Save message
    # Pass message to interview service
    # Call OpenAI from interview service
    # Save AI response
    # Return response
    pass