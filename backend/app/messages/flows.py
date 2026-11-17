from sqlmodel import Session

from app.enums import MessageRole
from app.messages import service as messages_service
from app.messages.models import Message
from app.questions.models import InterviewQuestion
from app.openai.service import generate_message_response


def process_message(db: Session, question: InterviewQuestion, content: str) -> Message:
    """Persists the user's message, generates and persists the AI's reply, and returns the assistant message.

    Assumes the supplied question has already been authorized.
    """
    phase = question.phase

    # Get message history for phase
    history = messages_service.get_all_by_phase(db, phase)

    # Save user message
    messages_service.save(db, phase.id, question.id, MessageRole.USER, content)

    ai_content = generate_message_response(phase, question, content, history)

    # Save AI response
    return messages_service.save(
        db, phase.id, question.id, MessageRole.ASSISTANT, ai_content
    )
