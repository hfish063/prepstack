from sqlmodel import Session

from app.enums import MessageRole
from app.messages import service as messages_service
from app.messages.models import Message
from app.interviews.phases.models import InterviewPhase
from app.openai.service import generate_message_response


def process_message(db: Session, phase: InterviewPhase, content: str) -> Message:
    """Persists the user's message, generates and persists the AI's reply, and returns the assistant message.

    Assumes the supplied phase has already been authorized.
    """
    phase_id = phase.id

    # Get message history for phase
    history = messages_service.get_all_by_phase(db, phase)

    # Save user message
    messages_service.save(db, phase_id, MessageRole.USER, content)

    ai_content = generate_message_response(phase, content, history)

    # Save AI response
    return messages_service.save(db, phase_id, MessageRole.ASSISTANT, ai_content)
