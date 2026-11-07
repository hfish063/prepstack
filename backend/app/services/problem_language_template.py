from fastapi import HTTPException
from sqlmodel import Session, select

from app.models.problem_language_template import ProblemLanguageTemplate
from app.models.programming_language import ProgrammingLanguage


def get_language_template_for_problem(
    db: Session, problem_id: int, language_id: int
) -> ProblemLanguageTemplate:
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

    language_template = db.exec(statement).first()

    if not language_template:
        raise HTTPException(
            status_code=404,
            detail="No available language template found for this phase.",
        )

    return language_template
