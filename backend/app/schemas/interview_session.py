from datetime import datetime
from typing import Optional

from app.schemas.base import CamelModel


class InterviewSessionCreate(CamelModel):
    role: str
    experience_level: str
    topics: Optional[str] = None
    description: Optional[str] = None


class InterviewSessionRead(CamelModel):
    id: int
    role: str
    experience_level: str
    topics: str
    description: str
    user_id: str
    created_at: datetime
    updated_at: datetime
