from typing import Optional

from sqlmodel import Field, SQLModel


class ProblemLanguageTemplate(SQLModel, table=True):
    __tablename__ = "problem_language_templates"
    id: Optional[int] = Field(default=None, primary_key=True)
    problem_id: int = Field(foreign_key="coding_problems.id")
    language_id: int = Field(foreign_key="programming_languages.id")
    starter_code: str
    driver_code: str
