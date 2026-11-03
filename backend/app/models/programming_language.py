from typing import Optional

from sqlmodel import Field, SQLModel


class ProgrammingLanguage(SQLModel, table=True):
    __tablename__ = "programming_languages"
    id: Optional[int] = Field(default=None, primary_key=True)
    judge0_language_id: int
    extension: str
    is_enabled: bool
