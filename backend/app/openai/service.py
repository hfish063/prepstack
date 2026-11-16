from app.interviews.phases.models import InterviewPhase
from app.openai.prompts.factory import get_phase_prompt
from app.messages.models import Message
from app.openai.client import OpenAIClient
from app.questions.schemas import InterviewQuestionCreate

from openai.types.chat import ChatCompletionMessageParam


def generate_questions_for_interview_phase(
    phase: InterviewPhase,
) -> list[InterviewQuestionCreate]:
    prompt = _build_question_prompt(phase)

    client = OpenAIClient(system_message=prompt)

    results = client.chat_json_parse().get("questions", [])

    if len(results) < phase.question_count:
        raise ValueError(
            f"Expected {phase.question_count} questions, received {len(results)}."
        )

    questions = [
        InterviewQuestionCreate(text=text, ordinal=ordinal)
        for ordinal, text in enumerate(results[: phase.question_count], start=1)
    ]

    return questions


def _build_question_prompt(phase: InterviewPhase) -> str:
    """Builds a system prompt for generating interview questions.

    Question content is based on the provided interview phase.
    """
    strategy = get_phase_prompt(phase.phase_type)
    return strategy.build_question_prompt(phase.interview_session, phase.question_count)


def generate_message_response(
    phase: InterviewPhase, user_prompt: str, history: list[Message]
) -> str:
    """Generate a response to a user message.

    Response generation is based on:
        1. The provided interview phase
        2. The provided message history
    """
    prompt = _build_message_prompt(phase)

    client = OpenAIClient(system_message=prompt)

    return client.chat_completion(user_prompt, _serialize_message_history(history))


def _build_message_prompt(phase: InterviewPhase) -> str:
    """Builds a system prompt for generating message responses."""
    strategy = get_phase_prompt(phase.phase_type)
    return strategy.build_system_prompt(phase.interview_session)


def _serialize_message_history(
    history: list[Message],
) -> list[ChatCompletionMessageParam]:
    """Converts message list (history) into ChatCompletionMessageParam list."""
    return [
        {
            "role": message.role.value,
            "content": message.content,
        }
        for message in history
    ]
