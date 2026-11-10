from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, SQLModel


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
