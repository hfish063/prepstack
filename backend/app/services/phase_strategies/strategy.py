from abc import ABC, abstractmethod

from app.models.interview_session import InterviewSession
from app.models.interview_phase import InterviewPhase
from app.models.message import Message


class PhaseStrategy(ABC):
    @abstractmethod
    def build_system_prompt(self, interview: InterviewSession) -> str: ...

    @abstractmethod
    def should_advance_phase(
        self, phase: InterviewPhase, history: list[Message]
    ) -> bool: ...
