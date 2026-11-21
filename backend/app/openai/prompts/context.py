from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.enums import MessageKind, MessageRole, PhaseType


class PromptContext(BaseModel):
    model_config = ConfigDict(from_attributes=True, frozen=True)


class InterviewContext(PromptContext):
    """Context class used to provide information about the current
    interview session to the AI client.
    """

    role: str
    experience_level: str
    topics: Optional[str] = None
    description: Optional[str] = None


class QuestionContext(PromptContext):
    """Context class used to generate questions for an interview session."""

    interview: InterviewContext
    phase_type: PhaseType
    question_count: int


class ConversationContext(PromptContext):
    """Context class used to provide conversation metadata to the AI client."""

    interview: InterviewContext
    phase_type: PhaseType
    question: str


class HintContext(PromptContext):
    """Context class used to generate hints for interview questions."""

    question: str
    hint_number: int


class TranscriptMessage(PromptContext):
    """A single message in a question transcript. Kind distinguishes hints from answers."""

    role: MessageRole
    kind: MessageKind
    content: str


class QuestionTranscript(PromptContext):
    """A question and every message exchanged about it. Unanswered questions have no messages."""

    question: str
    messages: list[TranscriptMessage]


class PhaseEvaluationContext(PromptContext):
    """Context class used by the AI client to generate an evaluation report."""

    interview: InterviewContext
    phase_type: PhaseType
    transcript: list[QuestionTranscript]


class PhaseEvaluationSummary(PromptContext):
    """Provides a summary for the evaluations of an interview session.

    Used by the AI client to generate an overall interview summary report.
    """

    phase_type: PhaseType
    summary: str
    score: int


class InterviewSummaryContext(PromptContext):
    """Context class used by the AI client to generate an overall interview summary report."""

    interview: InterviewContext
    phase_evaluations: list[PhaseEvaluationSummary]
