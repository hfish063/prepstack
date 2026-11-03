from typing import Any, Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


class ProblemExample(SQLModel, table=True):
    __tablename__ = "problem_examples"
    id: Optional[int] = Field(default=None, primary_key=True)
    problem_id: int = Field(foreign_key="coding_problems.id")
    input: dict = Field(sa_column=Column(JSONB, nullable=False))
    expected_output: Any = Field(sa_column=Column(JSONB, nullable=False))
    explanation: Optional[str] = None
    ordinal: int
