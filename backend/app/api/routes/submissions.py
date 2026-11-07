from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user_id
from app.db.database import get_db

router = APIRouter(prefix="/submissions")


@router.post("/{phase_id}")
def run_submission(
    phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    pass
