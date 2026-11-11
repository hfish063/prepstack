from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user_id
from app.coding_problems.flows import get_coding_problem_details
from app.database.database import get_db
from app.interviews.phases.schemas import InterviewPhaseRead
from app.interviews.phases.service import advance_phase_to_target, get_coding_problem_id_for_phase
from app.coding_problems.schemas import CodingProblemRead
from app.language_templates.schemas import ProblemLanguageTemplateRead
from app.language_templates.service import get_language_template_for_problem

router = APIRouter(prefix="/phases")


@router.post(
    "/{phase_id}/advance/{target_phase_index}", response_model=InterviewPhaseRead
)
def advance_phase(
    phase_id: int,
    target_phase_index: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    return advance_phase_to_target(db, user_id, phase_id, target_phase_index)


@router.get("/{phase_id}/coding-problem", response_model=CodingProblemRead)
def get_coding_problem(
    phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    problem_id = get_coding_problem_id_for_phase(db, user_id, phase_id)
    return get_coding_problem_details(db, problem_id)


@router.get(
    "/{phase_id}/coding-problem/template", response_model=ProblemLanguageTemplateRead
)
def get_coding_problem_language_template(
    phase_id: int,
    language_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    problem_id = get_coding_problem_id_for_phase(db, user_id, phase_id)
    return get_language_template_for_problem(db, problem_id, language_id)
