from app.exceptions import UpstreamServiceError
from app.interviews.phases.models import InterviewPhase
from app.openai.prompts.factory import get_phase_prompt
from app.messages.models import Message
from app.openai.client import OpenAIClient
from app.questions.models import InterviewQuestion
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
    phase: InterviewPhase,
    question: InterviewQuestion,
    user_prompt: str,
    history: list[Message],
) -> str:
    """Generate a response to a user message.

    Response generation is based on:
        1. The provided interview phase
        2. The provided message history
    """
    prompt = _build_message_prompt(phase, question)

    client = OpenAIClient(system_message=prompt)

    return client.chat_completion(user_prompt, _serialize_message_history(history))


def _build_message_prompt(phase: InterviewPhase, question: InterviewQuestion) -> str:
    """Builds a system prompt for generating message responses."""
    strategy = get_phase_prompt(phase.phase_type)
    return strategy.build_system_prompt(phase.interview_session, question)


def generate_question_hint(
    question: InterviewQuestion, history: list[Message], hint_number: int
) -> str:
    """Generate a hint for an interview question"""
    prompt = _build_hint_prompt(question.phase, question, hint_number)

    client = OpenAIClient(system_message=prompt)

    hint = client.chat_completion(history=_serialize_message_history(history))

    if not hint:
        raise UpstreamServiceError("Failed to generate a question hint.")

    return hint


def _build_hint_prompt(
    phase: InterviewPhase, question: InterviewQuestion, hint_number: int
) -> str:
    """Builds a system prompt for generating a question hint."""
    strategy = get_phase_prompt(phase.phase_type)
    return strategy.build_hint_prompt(question, hint_number)


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
