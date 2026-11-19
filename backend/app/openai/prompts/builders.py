from app.enums import PhaseType
from app.openai.prompts.base import BASE_SYSTEM_PROMPT
from app.openai.prompts.context import ConversationContext, HintContext, QuestionContext
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


def build_message_prompt(context: ConversationContext) -> str:
    return (
        BASE_SYSTEM_PROMPT
        + "\n"
        + MESSAGE_PROMPTS[context.phase_type].format(
            interview=context.interview, question=context.question
        )
    )


def build_question_prompt(context: QuestionContext) -> str:
    return (
        BASE_SYSTEM_PROMPT
        + "\n"
        + SYSTEM_QUESTION_PROMPT.format(
            interview=context.interview,
            phase=context.phase_type,
            question_count=context.question_count,
        )
    )


def build_hint_prompt(context: HintContext) -> str:
    return (
        BASE_SYSTEM_PROMPT
        + "\n"
        + SYSTEM_HINT_PROMPT.format(
            question=context.question, hint_number=context.hint_number
        )
    )


def build_interview_summary_prompt() -> str:
    return BASE_SYSTEM_PROMPT + "\n" + INTERVIEW_SUMMARY_PROMPT.format()


def build_phase_evaluation_Prompt() -> str:
    return BASE_SYSTEM_PROMPT + "\n" + INTERVIEW_SUMMARY_PROMPT.format()
