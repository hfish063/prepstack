from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field

from app.schemas.base import CamelModel


class Message(CamelModel):
    __table_name__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    phase_id = None
    content: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), server_default=func.now()),
    )
