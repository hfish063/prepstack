from datetime import datetime
from typing import Optional

from sqlmodel import Field

from app.enums import InterviewStatus
from app.schemas import CamelModel


class PhaseQuestionConfig(CamelModel):
    behavioral: int = Field(default=5, ge=1, le=20)
    conceptual: int = Field(default=5, ge=1, le=20)


class InterviewSessionCreate(CamelModel):
    role: str
    experience_level: str
    topics: Optional[str] = None
    description: Optional[str] = None
    question_counts: PhaseQuestionConfig = PhaseQuestionConfig()


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
