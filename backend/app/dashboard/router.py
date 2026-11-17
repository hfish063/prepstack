from clerk_backend_api import Session
from fastapi import APIRouter, Depends

from app.auth.clerk import get_current_user_id
from app.dashboard.schemas import DashboardSummaryRead
from app.database.database import get_db
from app.dashboard import service as dashboard_service

router = APIRouter(prefix="/dashboard")


@router.get("", response_model=DashboardSummaryRead)
def get_dashboard_summary(
    db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    return dashboard_service.get(db, user_id)
