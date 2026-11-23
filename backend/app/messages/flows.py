from sqlmodel import Session

from app.enums import MessageKind, MessageRole
from app.messages import service as messages_service
from app.messages.models import Message
from app.questions.models import InterviewQuestion
from app.openai.service import generate_message_response, generate_question_hint


def process_message(db: Session, question: InterviewQuestion, content: str) -> Message:
    """Persists the user's message, generates and persists the AI's reply, and returns the assistant message.

    Assumes the supplied question has already been authorized.
    """
    phase = question.phase

    # Get message history for this question
    history = messages_service.get_all_by_question(db, question)

    # Save user message
    messages_service.save(
        db, phase.id, question.id, MessageRole.USER, MessageKind.MESSAGE, content
    )

    ai_content = generate_message_response(phase, question, content, history)

    # Save AI response
    return messages_service.save(
        db,
        phase.id,
        question.id,
        MessageRole.ASSISTANT,
        MessageKind.MESSAGE,
        ai_content,
    )


def request_hint(db: Session, question: InterviewQuestion) -> Message:
    """Generates question hint from AI client, persist the response as Message of type 'hint'."""
    history = messages_service.get_all_by_question(db, question)

    hint_number = 1
    for message in history:
        if message.kind == MessageKind.HINT:
            hint_number += 1

    ai_content = generate_question_hint(question, history, hint_number)

    return messages_service.save(
        db,
        question.phase_id,
        question.id,
        MessageRole.ASSISTANT,
        MessageKind.HINT,
        ai_content,
    )
