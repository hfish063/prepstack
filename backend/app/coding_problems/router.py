from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from starlette import status

from app.exceptions import ResourceNotFoundError
from app.auth.clerk import get_current_user_id
from app.interviews.phases.service import get_phase_for_user
from app.coding_problems.exceptions import (
    NoTestCasesConfiguredError,
)
from app.coding_problems.flows import (
    get_coding_problem_details,
    run_against_examples,
    submit_candidate_code,
)
from app.coding_problems.schemas import CodingProblemRead, RunCodeRequest
from app.coding_problems.service import get_coding_problem_by_phase
from app.database.database import get_db
from app.judge0.dependencies import Judge0ExecutionDeps
from app.language_templates.schemas import ProblemLanguageTemplateRead
from app.language_templates.service import get_language_template_for_problem
from app.submissions.schemas import ProblemSubmissionRead, SubmissionResultRead

router = APIRouter(prefix="/coding-problems")


@router.post("/{phase_id}/run")
async def run_code(
    phase_id: int,
    run_code_request: RunCodeRequest,
    deps: Judge0ExecutionDeps = Depends(Judge0ExecutionDeps),
    user_id=Depends(get_current_user_id),
) -> list[SubmissionResultRead]:
    try:
        return await run_against_examples(
            deps,
            user_id,
            phase_id,
            run_code_request,
        )
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/{phase_id}/submit", response_model=ProblemSubmissionRead)
async def submit_code(
    phase_id: int,
    run_code_request: RunCodeRequest,
    deps: Judge0ExecutionDeps = Depends(Judge0ExecutionDeps),
    user_id=Depends(get_current_user_id),
) -> ProblemSubmissionRead:
    try:
        return await submit_candidate_code(deps, user_id, phase_id, run_code_request)
    except NoTestCasesConfiguredError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ResourceNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/{phase_id}", response_model=CodingProblemRead)
def get_coding_problem(
    phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    phase = get_phase_for_user(db, phase_id, user_id)

    if not phase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find phase for user.",
        )

    problem = get_coding_problem_by_phase(db, phase)

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No coding problems exist for this phase.",
        )

    return get_coding_problem_details(db, problem)


@router.get("/{phase_id}/template", response_model=ProblemLanguageTemplateRead)
def get_coding_problem_language_template(
    phase_id: int,
    language_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    phase = get_phase_for_user(db, phase_id, user_id)

    if not phase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find phase for user.",
        )

    problem = get_coding_problem_by_phase(db, phase)

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No coding problems exist for this phase.",
        )

    template = get_language_template_for_problem(db, problem.id, language_id)

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No language templates exist for this problem.",
        )

    return template
