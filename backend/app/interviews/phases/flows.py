from sqlmodel import Session

from app.enums import PhaseType
from app.messages import service as messages_service
from app.interviews.phases import service as phases_service
from app.interviews.phases.models import InterviewPhase

ADVANCE_BREAKPOINT = 15  # Attempt to trigger a phase transition if user's message count reaches breakpoint for an interview session


def should_advance_phase(db: Session, user_id: str, phase_id: int) -> bool:
    history_len = len(messages_service.get_phase_messages(db, phase_id))

    return history_len > 15


def advance_to_next_phase(db: Session, user_id: str, phase_id: int) -> InterviewPhase:
    current_phase = phases_service.get_phase_for_user(db, phase_id, user_id)
    current_phase_index = current_phase.order_index

    # Don't advance past Technical (final) phase
    if current_phase_index == len(PhaseType) - 1:
        return current_phase

    next_phase_index = (current_phase_index + 1) % len(PhaseType)
    return phases_service.advance_phase_to_target(
        db, user_id, phase_id, next_phase_index
    )
