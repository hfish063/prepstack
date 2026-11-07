from sqlmodel import Session, select

from app.models.problem_example import ProblemExample


def get_examples_for_problem(db: Session, problem_id: int) -> list[ProblemExample]:
    statement = select(ProblemExample).where(ProblemExample.problem_id == problem_id)
    return db.exec(statement).all()
