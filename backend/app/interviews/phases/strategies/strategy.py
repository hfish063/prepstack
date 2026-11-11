from abc import ABC, abstractmethod

from app.interviews.sessions.models import InterviewSession
from app.interviews.phases.models import InterviewPhase
from app.messages.models import Message


class PhaseStrategy(ABC):
    @abstractmethod
    def build_system_prompt(self, interview: InterviewSession) -> str: ...
