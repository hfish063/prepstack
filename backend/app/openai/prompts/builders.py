from app.enums import PhaseType
from app.openai.prompts.base import BASE_SYSTEM_PROMPT
from app.openai.prompts.strings import (
    BEHAVIORAL_SYSTEM_PROMPT,
    CONCEPTUAL_SYSTEM_PROMPT,
    INTERVIEW_SUMMARY_PROMPT,
    SYSTEM_HINT_PROMPT,
    SYSTEM_QUESTION_PROMPT,
)

MESSAGE_PROMPTS: dict[PhaseType, str] = {
    PhaseType.BEHAVIORAL: BEHAVIORAL_SYSTEM_PROMPT,
    PhaseType.CONCEPTUAL: CONCEPTUAL_SYSTEM_PROMPT,
}


def build_message_prompt(phase_type: PhaseType) -> str:
    return BASE_SYSTEM_PROMPT + "\n" + MESSAGE_PROMPTS[phase_type]


def build_question_prompt() -> str:
    return BASE_SYSTEM_PROMPT + "\n" + SYSTEM_QUESTION_PROMPT


def build_hint_prompt() -> str:
    return BASE_SYSTEM_PROMPT + "\n" + SYSTEM_HINT_PROMPT


def build_interview_summary_prompt() -> str:
    return BASE_SYSTEM_PROMPT + "\n" + INTERVIEW_SUMMARY_PROMPT


def build_phase_evaluation_Prompt() -> str:
    return BASE_SYSTEM_PROMPT + "\n" + INTERVIEW_SUMMARY_PROMPT
