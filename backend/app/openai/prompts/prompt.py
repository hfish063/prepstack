from abc import ABC, abstractmethod

from app.interviews.sessions.models import InterviewSession
from app.questions.models import InterviewQuestion


class PhasePrompt(ABC):
    @abstractmethod
    def build_system_prompt(
        self, interview: InterviewSession, question: InterviewQuestion
    ) -> str: ...

    @abstractmethod
    def build_question_prompt(
        self, interview: InterviewSession, question_count: int
    ) -> str: ...

    @abstractmethod
    def build_hint_prompt(
        self, question: InterviewQuestion, hint_number: int
    ) -> str: ...
