from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from app.interviews.phases.models import InterviewPhase


class InterviewSummary(SQLModel, table=True):
    __tablename__ = "interview_summaries"
    id: Optional[int] = Field(default=None, primary_key=True)
    interview_id: int = Field(foreign_key="interview_sessions.id")
    overall_score: int = Field(ge=0, le=100)
    summary: str


class InterviewPhaseEvaluation(SQLModel, table=True):
    __tablename__ = "interview_phase_evaluations"
    id: Optional[int] = Field(default=None, primary_key=True)
    phase_id: int = Field(foreign_key="interview_phases.id")
    score: int = Field(ge=0, le=100)
    summary: str

    phase: InterviewPhase = Relationship()
