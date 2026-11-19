from app.exceptions import UpstreamServiceError
from app.interviews.evaluations.models import InterviewPhaseEvaluation
from app.interviews.phases.models import InterviewPhase
from app.interviews.sessions.models import InterviewSession
from app.messages.models import Message
from app.openai.client import OpenAIClient
from app.openai.prompts.context import (
    ConversationContext,
    HintContext,
    InterviewContext,
    QuestionContext,
)
from app.openai.prompts.builders import (
    build_hint_prompt,
    build_message_prompt,
    build_question_prompt,
)
from app.questions.models import InterviewQuestion
from app.questions.schemas import InterviewQuestionCreate

from openai.types.chat import ChatCompletionMessageParam


def _serialize_message_history(
    history: list[Message],
) -> list[ChatCompletionMessageParam]:
    """Converts message list (history) into ChatCompletionMessageParam list."""
    return [
        {
            "role": message.role.value,
            "content": message.content,
        }
        for message in history[-20:]
    ]


def generate_questions_for_interview_phase(
    phase: InterviewPhase,
) -> list[InterviewQuestionCreate]:
    """Generates interview questions for the provided phase.

    The amount of questions generated is based on the question_count InterviewPhase attribute.
    """
    context = QuestionContext(
        interview=InterviewContext.model_validate(phase.interview_session),
        phase_type=phase.phase_type,
        question_count=phase.question_count,
    )
    prompt = build_question_prompt(context)

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


def generate_message_response(
    phase: InterviewPhase,
    question: InterviewQuestion,
    user_prompt: str,
    history: list[Message],
) -> str:
    """Generate a response to a user message.

    Response generation is based on:
        1. The provided interview phase
        2. The current question
        2. The provided message history
    """
    context = ConversationContext(
        interview=InterviewContext.model_validate(phase.interview_session),
        phase_type=phase.phase_type,
        question=question.text,
    )
    prompt = build_message_prompt(context)

    client = OpenAIClient(system_message=prompt)

    response = client.chat_completion(user_prompt, _serialize_message_history(history))

    if not response:
        raise UpstreamServiceError("Failed to generate a message response.")

    return response


def generate_question_hint(
    question: InterviewQuestion, history: list[Message], hint_number: int
) -> str:
    """Generate a hint for an interview question"""
    context = HintContext(question=question.text, hint_number=hint_number)
    prompt = build_hint_prompt(context)

    client = OpenAIClient(system_message=prompt)

    hint = client.chat_completion(history=_serialize_message_history(history))

    if not hint:
        raise UpstreamServiceError("Failed to generate a question hint.")

    return hint


def generate_phase_evaluation(
    phase: InterviewPhase, transcript: str
) -> InterviewPhaseEvaluation:
    pass


def generate_interview_summary(
    interview: InterviewSession, phase_evaluations: list[InterviewPhaseEvaluation]
):
    pass
