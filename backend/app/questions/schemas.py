from typing import Optional

from app.schemas import CamelModel


class InterviewQuestionRead(CamelModel):
    id: int
    phase_id: int
    text: str
    ordinal: int


class InterviewQuestionCreate(CamelModel):
    text: str
    ordinal: int


class CustomQuestionAdd(CamelModel):
    text: str
