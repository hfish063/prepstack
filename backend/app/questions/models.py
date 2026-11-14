from typing import Optional

from sqlmodel import Field, SQLModel


class InterviewQuestion(SQLModel, table=True):
    __tablename__ = "interview_questions"

    id: Optional[int] = Field(default=None, primary_key=True)
    phase_id: int = Field(foreign_key="interview_phases.id", ondelete="CASCADE")
    text: str = Field(max_length=500)
    ordinal: int
