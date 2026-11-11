from datetime import datetime
from pydantic import Field

from app.schemas import CamelModel


class InterviewSessionNotesRead(CamelModel):
    text: str
    created_at: datetime
    updated_at: datetime


class InterviewSessionNotesCreate(CamelModel):
    text: str = Field(min_length=1, max_length=5000)


class InterviewSessionNotesUpdate(CamelModel):
    text: str = Field(max_length=5000)
