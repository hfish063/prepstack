from fastapi import APIRouter

from app.api.routes import health_check, interview_sessions, messages

router = APIRouter(prefix="/api")
router.include_router(health_check.router)
router.include_router(interview_sessions.router)
router.include_router(messages.router)
