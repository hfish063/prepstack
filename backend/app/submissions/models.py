from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, Relationship, SQLModel

from app.programming_languages.models import ProgrammingLanguage


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
    language: ProgrammingLanguage = Relationship()


class SubmissionResult(SQLModel, table=True):
    __tablename__ = "submission_results"
    id: Optional[int] = Field(default=None, primary_key=True)
    submission_id: int = Field(
        foreign_key="problem_submissions.id",
        ondelete="CASCADE",
        nullable=False,
        index=True,
    )
    test_case_id: int = Field(foreign_key="problem_test_cases.id")
    passed: bool
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    compile_output: Optional[str] = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now()),
    )
