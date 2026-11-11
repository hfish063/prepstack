from datetime import datetime
from typing import Optional

from app.enums import InterviewStatus
from app.schemas import CamelModel


class InterviewSessionCreate(CamelModel):
    role: str
    experience_level: str
    topics: Optional[str] = None
    description: Optional[str] = None


class InterviewSessionRead(CamelModel):
    id: int
    role: str
    experience_level: str
    topics: str | None
    description: str | None
    user_id: str
    status: InterviewStatus
    created_at: datetime
    updated_at: datetime
