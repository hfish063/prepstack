from abc import ABC, abstractmethod

from app.interviews.sessions.models import InterviewSession


class PhaseStrategy(ABC):
    @abstractmethod
    def build_system_prompt(self, interview: InterviewSession) -> str: ...

    @abstractmethod
    def build_question_prompt(
        self, interview: InterviewSession, question_count: int
    ) -> str: ...
