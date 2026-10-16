from sqlmodel import Session

from app.enums import MessageRole
from app.models.message import Message
from app.models.interview_phase import InterviewPhase
from app.models.interview_session import InterviewSession
from app.services.interview_phase_service import get_phase_for_user
from app.services.interview_session_service import get_user_interview_by_id
from app.services.message_service import get_phase_messages, save_message
from app.services.openai_service import generate_response
from app.services.phase_strategies.factory import get_phase_strategy


def process_message(db: Session, phase_id: int, user_id: str, content: str) -> Message:
    """Verifies phase ownership, persists the user's message, generates and persists the AI's reply, and returns the assistant message."""
    phase = get_phase_for_user(db, phase_id, user_id)  # Verify user ownership
    interview = get_user_interview_by_id(db, user_id, phase.interview_id)
    save_message(db, phase_id, MessageRole.USER, content)

    # Get message history for phase
    history = get_phase_messages(db, phase_id)

    # Build AI prompt
    # Call OpenAI
    ai_content = generate_response(build_prompt(phase, history, interview))

    # TODO: Determine whether to advance phases

    # Save AI response
    return save_message(db, phase_id, MessageRole.ASSISTANT, ai_content)


def build_prompt(
    phase: InterviewPhase, history: list[Message], interview: InterviewSession
) -> list[dict]:
    """Builds the OpenAI message list: the phase type's strategy-specific system prompt followed by the phase's prior history."""
    strategy = get_phase_strategy(phase.phase_type)
    system_prompt = strategy.build_system_prompt(interview)

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend({"role": m.role.value, "content": m.content} for m in history)

    return messages
