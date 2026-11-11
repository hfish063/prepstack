from sqlmodel import Session, select

from app.coding_problems.models import CodingProblem
from app.interviews.phases.models import InterviewPhase


def get_coding_problem(db: Session, problem_id: int) -> CodingProblem | None:
    statement = select(CodingProblem).where(
        CodingProblem.id == problem_id, CodingProblem.is_published == True
    )
    return db.exec(statement).one_or_none()


def get_coding_problem_by_phase(
    db: Session, phase: InterviewPhase
) -> CodingProblem | None:
    if not phase.coding_problem_id:
        return None

    return db.exec(
        select(CodingProblem).where(CodingProblem.id == phase.coding_problem_id)
    ).one_or_none()
