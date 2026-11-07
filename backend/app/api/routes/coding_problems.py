from fastapi import APIRouter, Depends

from app.auth.clerk import get_current_user_id
from app.db.database import get_db
from app.judge0.dependencies import get_judge0_client
from app.schemas.code_execution import RunCodeRequest
from app.services.code_execution import ExampleRunResultRead, Judge0ExecutionDeps, run_against_examples


router = APIRouter(prefix="/coding-problems")


@router.post("/{phase_id}/run")
async def run_code(
    phase_id: int,
    run_code_request: RunCodeRequest,
    deps: Judge0ExecutionDeps = Depends(Judge0ExecutionDeps),
    user_id=Depends(get_current_user_id),
) -> list[ExampleRunResultRead]:
    return await run_against_examples(
        deps,
        user_id,
        phase_id,
        run_code_request,
    )
