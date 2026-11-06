from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user_id
from app.db.database import get_db
from app.schemas.coding_problem import CodingProblemRead
from app.schemas.interview_phase import InterviewPhaseRead
from app.schemas.problem_language_template import ProblemLanguageTemplateRead
from app.schemas.programming_language import ProgrammingLanguageRead
from app.services.interview_phase import (
    advance_phase_to_target,
    get_coding_problem_details_for_phase,
    get_language_template_for_phase,
)

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
    problem, problem_examples, available_languages = (
        get_coding_problem_details_for_phase(db, user_id, phase_id)
    )

    return CodingProblemRead(
        **problem.model_dump(), examples=problem_examples, languages=available_languages
    )


@router.get(
    "/{phase_id}/coding-problem/template", response_model=ProblemLanguageTemplateRead
)
def get_coding_problem_language_template(
    phase_id: int,
    language_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    return get_language_template_for_phase(db, user_id, phase_id, language_id)
