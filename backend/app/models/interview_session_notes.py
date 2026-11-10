from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class InterviewSessionNotes(SQLModel, table=True):
    __tablename__ = "interview_session_notes"
    id: Optional[int] = Field(default=None, primary_key=True)
    interview_id: int = Field(
        foreign_key="interview_sessions.id", ondelete="CASCADE", index=True, unique=True
    )
    text: str = Field(max_length=5000)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
