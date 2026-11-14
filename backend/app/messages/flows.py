from sqlmodel import Session

from app.enums import MessageRole
from app.interviews.sessions import service as interviews_service
from app.interviews.sessions.models import InterviewSession
from app.messages import service as messages_service
from app.messages.models import Message
from app.openai.client import MODEL, generate_response
from app.interviews.phases.models import InterviewPhase
from app.interviews.phases.strategies.factory import get_phase_strategy
from app.openai.manager import OpenAIContextManager

context_manager = OpenAIContextManager(model=MODEL)


def process_message(
    db: Session, phase: InterviewPhase, user_id: str, content: str
) -> Message:
    """Persists the user's message, generates and persists the AI's reply, and returns the assistant message.

    Assumes the supplied phase has already been authorized.
    """
    phase_id = phase.id
    interview = interviews_service.get(db, user_id, phase.interview_id)

    messages_service.save(db, phase_id, MessageRole.USER, content)

    # Get message history for phase
    history = messages_service.get_all_by_phase(db, phase)

    # Build AI prompt
    # Call OpenAI
    ai_content = generate_response(build_prompt(phase, history, interview))

    # Save AI response
    return messages_service.save(db, phase_id, MessageRole.ASSISTANT, ai_content)


def build_prompt(
    phase: InterviewPhase, history: list[Message], interview: InterviewSession
) -> list[dict]:
    """Builds the OpenAI message list: the phase type's strategy-specific system prompt followed by the phase's prior history."""
    history = context_manager.select_history(history)

    strategy = get_phase_strategy(phase.phase_type)
    system_prompt = strategy.build_system_prompt(interview)

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend({"role": m.role.value, "content": m.content} for m in history)

    return messages
