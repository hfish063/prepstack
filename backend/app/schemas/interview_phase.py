from datetime import datetime
from typing import Optional

from app.enums import PhaseStatus, PhaseType
from app.schemas.base import CamelModel


class InterviewPhaseRead(CamelModel):
    id: int
    interview_id: int
    phase_type: PhaseType
    order_index: int
    status: PhaseStatus
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
