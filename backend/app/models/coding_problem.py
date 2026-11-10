from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, SQLModel

from app.enums import Difficulty


class CodingProblem(SQLModel, table=True):
    __tablename__ = "coding_problems"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    prompt: str
    difficulty: Difficulty
    is_published: bool
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now()),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
        ),
    )
