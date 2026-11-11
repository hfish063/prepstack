from fastapi import HTTPException
from sqlmodel import Session, select

from app.language_templates.models import ProblemLanguageTemplate
from app.programming_languages.models import ProgrammingLanguage


def get_programming_language(db: Session, language_id: int) -> ProgrammingLanguage:
    statement = select(ProgrammingLanguage).where(ProgrammingLanguage.id == language_id)
    language = db.exec(statement).first()

    if not language:
        raise HTTPException(
            status_code=404,
            detail=f"No programming language with id: {language_id} found.",
        )

    return language


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
