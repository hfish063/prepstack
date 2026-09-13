from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, SQLModel


class InterviewSession(SQLModel, table=True):
    __tablename__ = "interview_sessions"

    id: Optional[int] = Field(default=None, primary_key=True)
    role: str
    experience_level: str
    topics: str = Field(default="")
    description: str = Field(default="")
    user_id: str = Field(index=True)
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
