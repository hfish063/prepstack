from abc import ABC, abstractmethod

from app.models.interview_session import InterviewSession
from app.models.interview_phase import InterviewPhase
from app.models.message import Message


class PhaseStrategy(ABC):
    @abstractmethod
    def build_system_prompt(self, interview: InterviewSession) -> str: ...