from fastapi import APIRouter, Depends
from sqlmodel import Session
from starlette import status

from app.auth.clerk import get_current_user_id
from app.interviews.phases.service import get_phase_for_user, get_mutable_phase_for_user
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
from app.submissions.schemas import (
    ProblemSubmissionHistoryRead,
    ProblemSubmissionSummaryRead,
    SubmissionResultRead,
)
from app.submissions.service import delete_all_submissions, get_all_submissions

router = APIRouter(prefix="/coding-problems")


@router.post("/{phase_id}/run")
def run_code(
    phase_id: int,
    run_code_request: RunCodeRequest,
    deps: Judge0ExecutionDeps = Depends(Judge0ExecutionDeps),
    user_id=Depends(get_current_user_id),
) -> list[SubmissionResultRead]:
    return run_against_examples(
        deps,
        user_id,
        phase_id,
        run_code_request,
    )


@router.post("/{phase_id}/submit", response_model=ProblemSubmissionSummaryRead)
def submit_code(
    phase_id: int,
    run_code_request: RunCodeRequest,
    deps: Judge0ExecutionDeps = Depends(Judge0ExecutionDeps),
    user_id=Depends(get_current_user_id),
) -> ProblemSubmissionSummaryRead:
    phase = get_mutable_phase_for_user(deps.db, phase_id, user_id)

    return submit_candidate_code(deps, user_id, phase, run_code_request)


@router.get("/{phase_id}", response_model=CodingProblemRead)
def get_coding_problem(
    phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    phase = get_phase_for_user(db, phase_id, user_id)

    problem = get_coding_problem_by_phase(db, phase)

    return get_coding_problem_details(db, problem)


@router.get("/{phase_id}/template", response_model=ProblemLanguageTemplateRead)
def get_coding_problem_language_template(
    phase_id: int,
    language_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    phase = get_phase_for_user(db, phase_id, user_id)

    problem = get_coding_problem_by_phase(db, phase)

    return get_language_template_for_problem(db, problem.id, language_id)


@router.get(
    "/{phase_id}/submissions", response_model=list[ProblemSubmissionHistoryRead]
)
def get_problem_submissions(
    phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    phase = get_phase_for_user(db, phase_id, user_id)

    return get_all_submissions(db, phase)


@router.delete(
    "/{phase_id}/submissions/delete/all",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_problem_submissions(
    phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    phase = get_mutable_phase_for_user(db, phase_id, user_id)

    return delete_all_submissions(db, phase)
