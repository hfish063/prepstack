from datetime import datetime
from typing import Optional

from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel

from app.enums import PhaseStatus, PhaseType
from app.interviews.sessions.models import InterviewSession


class InterviewPhase(SQLModel, table=True):
    __tablename__ = "interview_phases"
    __table_args__ = (UniqueConstraint("interview_id", "order_index"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    interview_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("interview_sessions.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        )
    )
    coding_problem_id: Optional[int] = None
    phase_type: PhaseType
    order_index: int  # 0 behavioral 1 conceptual 2 technical
    status: PhaseStatus
    question_count: Optional[int] = Field(default=5, le=20)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    interview_session: InterviewSession = Relationship()
