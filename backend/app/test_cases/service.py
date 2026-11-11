from sqlmodel import Session, select

from app.test_cases.models import ProblemTestCase


def get_example_cases_for_problem(
    db: Session, problem_id: int
) -> list[ProblemTestCase]:
    statement = select(ProblemTestCase).where(
        ProblemTestCase.problem_id == problem_id, ProblemTestCase.hidden == False
    )
    return db.exec(statement).all()


def get_test_cases_for_problem(db: Session, problem_id: int) -> list[ProblemTestCase]:
    statement = select(ProblemTestCase).where(ProblemTestCase.problem_id == problem_id)
    return db.exec(statement).all()
