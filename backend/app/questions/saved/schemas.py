from datetime import datetime
from typing import Optional

from pydantic import Field
from app.enums import PhaseType
from app.schemas import CamelModel


class SavedQuestionRead(CamelModel):
    id: int
    content: str
    phase_type: PhaseType
    tags: list[SavedQuestionTagRead]
    created_at: datetime


class SavedQuestionCreate(CamelModel):
    content: str = Field(max_length=500, min_length=1)
    phase_type: PhaseType
    tags: Optional[list[SavedQuestionTagCreate]] = None


class SavedQuestionTagRead(CamelModel):
    content: str
    created_at: datetime


class SavedQuestionTagCreate(CamelModel):
    content: str = Field(max_length=64, min_length=1)
