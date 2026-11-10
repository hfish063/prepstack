from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, SQLModel


class ProblemSubmission(SQLModel, table=True):
    __tablename__ = "problem_submissions"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    problem_id: int = Field(foreign_key="coding_problems.id")
    language_id: int = Field(foreign_key="programming_languages.id")
    phase_id: int = Field(
        foreign_key="interview_phases.id",
        ondelete="CASCADE",
        nullable=False,
        index=True,
    )
    source_code: str
    accepted: bool = False
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now()),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now()),
    )
