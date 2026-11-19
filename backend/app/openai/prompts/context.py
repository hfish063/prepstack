from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.enums import PhaseType


class PromptContext(BaseModel):
    model_config = ConfigDict(from_attributes=True, frozen=True)


class InterviewContext(PromptContext):
    role: str
    experience_level: str
    topics: Optional[str] = None
    description: Optional[str] = None


class QuestionContext(PromptContext):
    interview: InterviewContext
    phase_type: PhaseType
    question_count: int


class ConversationContext(PromptContext):
    interview: InterviewContext
    phase_type: PhaseType
    question: str


class HintContext(PromptContext):
    question: str
    hint_number: int
