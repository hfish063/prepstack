from fastapi import APIRouter


from app.interviews.sessions import router as interview_sessions
from app.interviews.phases import router as interview_phases
from app.coding_problems import router as coding_problems
from app.questions import router as questions_router
from app.questions.saved import router as saved_questions_router
from app.dashboard import router as dashboard_router

router = APIRouter(prefix="/api")
router.include_router(interview_sessions.router)
router.include_router(interview_phases.router)
router.include_router(coding_problems.router)
router.include_router(questions_router.router)
router.include_router(saved_questions_router.router)
router.include_router(dashboard_router.router)


@router.get("/health")
async def health_check():
    return {"status": "ok"}
