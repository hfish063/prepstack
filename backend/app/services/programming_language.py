from sqlmodel import Session, select

from app.models.problem_language_template import ProblemLanguageTemplate
from app.models.programming_language import ProgrammingLanguage


def get_available_languages_for_problem(
    db: Session, problem_id
) -> list[ProgrammingLanguage]:
    statement = (
        select(ProgrammingLanguage)
        .join(
            ProblemLanguageTemplate,
            ProblemLanguageTemplate.language_id == ProgrammingLanguage.id,
        )
        .where(
            ProblemLanguageTemplate.problem_id == problem_id,
            ProgrammingLanguage.is_enabled == True,
        )
    )

    return db.exec(statement).all()
