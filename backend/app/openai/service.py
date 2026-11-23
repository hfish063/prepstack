from collections import defaultdict

from app.coding_problems.models import CodingProblem
from app.exceptions import UpstreamServiceError
from app.interviews.evaluations.models import InterviewPhaseEvaluation
from app.interviews.evaluations.schemas import (
    InterviewPhaseEvaluationCreate,
    InterviewSummaryCreate,
)
from app.interviews.phases.models import InterviewPhase
from app.interviews.sessions.models import InterviewSession
from app.messages.models import Message
from app.openai.client import OpenAIClient
from app.openai.prompts.context import (
    CodingEvaluationContext,
    CodingProblemContext,
    ConversationContext,
    HintContext,
    InterviewContext,
    InterviewSummaryContext,
    PhaseEvaluationSummary,
    PhaseEvaluationContext,
    QuestionContext,
    QuestionTranscript,
    TranscriptMessage,
)
from app.openai.prompts.builders import (
    build_hint_prompt,
    build_interview_summary_prompt,
    build_message_prompt,
    build_phase_evaluation_prompt,
    build_question_prompt,
    build_coding_evaluation_prompt,
)
from app.openai.schemas import (
    InterviewPhaseEvaluationResponse,
    InterviewSummaryResponse,
    CodingEvaluationResponse,
)
from app.questions.models import InterviewQuestion
from app.questions.schemas import InterviewQuestionCreate

from openai.types.chat import ChatCompletionMessageParam

from app.submissions.models import ProblemSubmission


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
    prompt = build_message_prompt(phase.phase_type)

    client = OpenAIClient(system_message=prompt)

    response = client.chat_completion(
        user_prompt, context, _serialize_message_history(history)
    )

    if not response:
        raise UpstreamServiceError("Failed to generate a message response.")

    return response


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
    prompt = build_question_prompt()

    client = OpenAIClient(system_message=prompt)

    results = client.chat_json_parse(context=context).get("questions", [])

    if len(results) < phase.question_count:
        raise ValueError(
            f"Expected {phase.question_count} questions, received {len(results)}."
        )

    questions = [
        InterviewQuestionCreate(text=text, ordinal=ordinal)
        for ordinal, text in enumerate(results[: phase.question_count], start=1)
    ]

    return questions


def generate_question_hint(
    question: InterviewQuestion, history: list[Message], hint_number: int
) -> str:
    """Generate a hint for an interview question"""
    context = HintContext(question=question.text, hint_number=hint_number)
    prompt = build_hint_prompt()

    client = OpenAIClient(system_message=prompt)

    hint = client.chat_completion(
        context=context, history=_serialize_message_history(history)
    )

    if not hint:
        raise UpstreamServiceError("Failed to generate a question hint.")

    return hint


def _build_transcript(
    questions: list[InterviewQuestion], messages: list[Message]
) -> list[QuestionTranscript]:
    """Groups messages under their question, keeping questions without messages."""
    messages_by_question: dict[int, list[TranscriptMessage]] = defaultdict(list)
    for message in messages:
        messages_by_question[message.question_id].append(
            TranscriptMessage.model_validate(message)
        )

    return [
        QuestionTranscript(
            question=question.text, messages=messages_by_question[question.id]
        )
        for question in questions
    ]


def generate_phase_evaluation(
    phase: InterviewPhase,
    questions: list[InterviewQuestion],
    messages: list[Message],
) -> InterviewPhaseEvaluationCreate:
    """Generates an evaluation of the candidate's performance in a single phase."""
    context = PhaseEvaluationContext(
        interview=InterviewContext.model_validate(phase.interview_session),
        phase_type=phase.phase_type,
        transcript=_build_transcript(questions, messages),
    )
    sys_prompt = build_phase_evaluation_prompt()

    client = OpenAIClient(system_message=sys_prompt)

    response = client.chat_parse(context, InterviewPhaseEvaluationResponse)

    if not response:
        raise UpstreamServiceError("Failed to generate a phase evaluation.")

    return InterviewPhaseEvaluationCreate(**response.model_dump())


def generate_coding_review(
    phase: InterviewPhase,
    problem: CodingProblem,
    submission: ProblemSubmission,
    attempts: int,
) -> CodingEvaluationResponse:
    """Generates a review of the candidate's final coding problem submission."""
    context = CodingEvaluationContext(
        interview=InterviewContext.model_validate(phase.interview_session),
        problem=CodingProblemContext.model_validate(problem),
        language=submission.language.name,
        source_code=submission.source_code,
        tests_passed=submission.passed_test_cases,
        tests_total=submission.total_test_cases,
        attempts=attempts,
    )
    sys_prompt = build_coding_evaluation_prompt()

    client = OpenAIClient(system_message=sys_prompt)

    response = client.chat_parse(context, CodingEvaluationResponse)

    if not response:
        raise UpstreamServiceError("Failed to generate a coding evaluation.")

    return response


def generate_interview_summary(
    interview: InterviewSession, phase_evaluations: list[InterviewPhaseEvaluation]
) -> InterviewSummaryCreate:
    """Generates an overall interview summary from the completed phase evaluations."""
    context = InterviewSummaryContext(
        interview=InterviewContext.model_validate(interview),
        phase_evaluations=[
            PhaseEvaluationSummary(
                phase_type=evaluation.phase.phase_type,
                summary=evaluation.summary,
                score=evaluation.score,
            )
            for evaluation in phase_evaluations
        ],
    )
    sys_prompt = build_interview_summary_prompt()

    client = OpenAIClient(system_message=sys_prompt)

    response = client.chat_parse(
        context=context, response_model=InterviewSummaryResponse
    )

    if not response:
        raise UpstreamServiceError("Failed to generate an interview summary.")

    return InterviewSummaryCreate(
        overall_score=response.score, summary=response.summary
    )
