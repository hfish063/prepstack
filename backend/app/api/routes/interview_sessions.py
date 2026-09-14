from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.auth.clerk import get_current_user
from app.schemas.interview_session import InterviewSessionCreate, InterviewSessionRead
from app.db.database import get_db
from app.services.interview_session_service import create_user_interview, get_all_user_interviews


router = APIRouter(prefix="/interviews")

@router.get("/all")
def find_all_interview_sessions(db: Session = Depends(get_db), auth = Depends(get_current_user)):
    user_id = auth.payload["sub"]
    return get_all_user_interviews(db, user_id)

@router.post("/save", response_model=InterviewSessionRead, status_code=status.HTTP_201_CREATED)
def save_interview_session(new_interview_session: InterviewSessionCreate, db: Session = Depends(get_db), auth = Depends(get_current_user)):
    user_id = auth.payload["sub"]
    return create_user_interview(db, new_interview_session, "123")

@router.delete("/delete/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview_session(interview_id: int, db: Session = Depends(get_db), auth = Depends(get_current_user)):
    user_id = auth.payload["sub"]
    pass
