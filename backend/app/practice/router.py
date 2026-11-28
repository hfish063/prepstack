from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user_id
from app.coding_problems.schemas import CodingProblemRead, RunCodeRequest
from app.database.database import get_db
from app.judge0.dependencies import Judge0ExecutionDeps
from app.language_templates.schemas import ProblemLanguageTemplateRead
from app.submissions.schemas import (
    ProblemSubmissionHistoryRead,
    ProblemSubmissionSummaryRead,
    SubmissionResultRead,
)

router = APIRouter(prefix="/practice")


@router.get("/problems", response_model=list[CodingProblemRead])
def find_all_practice_problems(
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    pass


@router.get("/problems/{problem_id}", response_model=CodingProblemRead)
def find_practice_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    pass


@router.get(
    "/problems/{problem_id}/template", response_model=ProblemLanguageTemplateRead
)
def find_practice_problem_language_template(
    problem_id: int,
    language_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    pass


@router.post("/problems/{problem_id}/run")
def run_practice_code(
    problem_id: int,
    run_code_request: RunCodeRequest,
    deps: Judge0ExecutionDeps = Depends(Judge0ExecutionDeps),
    user_id=Depends(get_current_user_id),
) -> list[SubmissionResultRead]:
    pass


@router.post(
    "/problems/{problem_id}/submit", response_model=ProblemSubmissionSummaryRead
)
def submit_practice_code(
    problem_id: int,
    run_code_request: RunCodeRequest,
    deps: Judge0ExecutionDeps = Depends(Judge0ExecutionDeps),
    user_id=Depends(get_current_user_id),
) -> ProblemSubmissionSummaryRead:
    pass


@router.get(
    "/problems/{problem_id}/submissions",
    response_model=list[ProblemSubmissionHistoryRead],
)
def find_practice_problem_submissions(
    problem_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    pass
