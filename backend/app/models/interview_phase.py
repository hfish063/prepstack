from datetime import datetime
from typing import Optional

from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint
from sqlmodel import Field, SQLModel

from app.enums import PhaseStatus, PhaseType


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
    coding_problem_id: Optional[int] = None  # Optional, for future implementation
    phase_type: PhaseType
    order_index: int  # 0 behavioral 1 conceptual 2 technical
    status: PhaseStatus
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
