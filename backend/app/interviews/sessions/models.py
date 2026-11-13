from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, SQLModel

from app.enums import InterviewStatus


class InterviewSession(SQLModel, table=True):
    __tablename__ = "interview_sessions"

    id: Optional[int] = Field(default=None, primary_key=True)
    role: str = Field(max_length=100)
    experience_level: str
    topics: Optional[str] = Field(default=None, max_length=300)
    description: Optional[str] = Field(default=None, max_length=2000)
    user_id: str = Field(index=True)
    status: InterviewStatus = Field(default=InterviewStatus.IN_PROGRESS)
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
