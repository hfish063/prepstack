from datetime import datetime
from typing import Optional

from sqlmodel import Field

from app.enums import PhaseStatus, PhaseType
from app.schemas.base import CamelModel


class InterviewPhase(CamelModel):
    __table_name__ = "interview_phases"

    id: Optional[int] = Field(default=None, primary_key=True)
    interview_id = None
    coding_problem_id = None # Optional, for future implementation
    phase_type: PhaseType
    order_index: int # 0 behavioral 1 conceptual 2 technical
    status: PhaseStatus 
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

