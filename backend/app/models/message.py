from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime, ForeignKey, Integer, func
from sqlmodel import Field, SQLModel

from app.enums import MessageRole


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    phase_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("interview_phases.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        )
    )
    content: str
    role: MessageRole
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now()),
    )
