from fastapi import APIRouter, Depends

from app.auth.clerk import get_current_user_id
from app.judge0.dependencies import Judge0ExecutionDeps
from app.schemas.code_execution import RunCodeRequest
from app.schemas.problem_submission import ProblemSubmissionRead, SubmissionResultRead
from app.services.code_execution import run_against_examples, submit_candidate_code

router = APIRouter(prefix="/coding-problems")


@router.post("/{phase_id}/run")
async def run_code(
    phase_id: int,
    run_code_request: RunCodeRequest,
    deps: Judge0ExecutionDeps = Depends(Judge0ExecutionDeps),
    user_id=Depends(get_current_user_id),
) -> list[SubmissionResultRead]:
    return await run_against_examples(
        deps,
        user_id,
        phase_id,
        run_code_request,
    )


@router.post("/{phase_id}/submit", response_model=ProblemSubmissionRead)
async def submit_code(
    phase_id: int,
    run_code_request: RunCodeRequest,
    deps: Judge0ExecutionDeps = Depends(Judge0ExecutionDeps),
    user_id=Depends(get_current_user_id),
) -> ProblemSubmissionRead:
    return await submit_candidate_code(deps, user_id, phase_id, run_code_request)
