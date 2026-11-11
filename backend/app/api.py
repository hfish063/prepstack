from fastapi import APIRouter


from app.health_check import router as health_check
from app.interviews import router as interview_sessions
from app.messages import router as messages
from app.phases import router as interview_phases
from app.coding_problems import router as coding_problems

router = APIRouter(prefix="/api")
router.include_router(health_check.router)
router.include_router(interview_sessions.router)
router.include_router(messages.router)
router.include_router(interview_phases.router)
router.include_router(coding_problems.router)
