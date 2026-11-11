from sqlmodel import Session, select

from app.language_templates.models import ProblemLanguageTemplate
from app.programming_languages.models import ProgrammingLanguage


def get_language_template_for_problem(
    db: Session, problem_id: int, language_id: int
) -> ProblemLanguageTemplate | None:
    statement = (
        select(ProblemLanguageTemplate)
        .join(
            ProgrammingLanguage,
            ProgrammingLanguage.id == ProblemLanguageTemplate.language_id,
        )
        .where(
            ProblemLanguageTemplate.language_id == language_id,
            ProblemLanguageTemplate.problem_id == problem_id,
            ProgrammingLanguage.is_enabled == True,
        )
    )

    return db.exec(statement).one_or_none()
