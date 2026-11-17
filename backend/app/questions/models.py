from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from app.interviews.phases.models import InterviewPhase


class InterviewQuestion(SQLModel, table=True):
    __tablename__ = "interview_questions"

    id: Optional[int] = Field(default=None, primary_key=True)
    phase_id: int = Field(
        foreign_key="interview_phases.id", index=True, ondelete="CASCADE"
    )
    text: str = Field(max_length=500)
    ordinal: int

    phase: InterviewPhase = Relationship()
