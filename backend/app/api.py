from fastapi import APIRouter


from app.interviews.sessions import router as interview_sessions
from app.messages import router as messages
from app.interviews.phases import router as interview_phases
from app.coding_problems import router as coding_problems

router = APIRouter(prefix="/api")
router.include_router(interview_sessions.router)
router.include_router(messages.router)
router.include_router(interview_phases.router)
router.include_router(coding_problems.router)

@router.get("/health")
async def health_check():
    return {"status": "ok"}
