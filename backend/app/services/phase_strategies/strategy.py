from abc import ABC, abstractmethod

from app.models.interview_session import InterviewSession


class PhaseStrategy(ABC):
    @abstractmethod
    def build_system_prompt(self, interview: InterviewSession) -> str: ...
