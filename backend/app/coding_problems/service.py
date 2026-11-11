from fastapi import HTTPException
from sqlmodel import Session, select

from app.coding_problems.models import CodingProblem


def get_coding_problem(db: Session, problem_id: int) -> CodingProblem:
    statement = select(CodingProblem).where(CodingProblem.id == problem_id)
    problem = db.exec(statement).first()

    if not problem:
        raise HTTPException(
            status_code=404, detail=f"No coding problems with id: {problem_id}."
        )

    if not problem.is_published:
        raise HTTPException(
            status_code=409,
            detail=f"Coding problem with id: {problem.id} is not published.",
        )

    return problem
