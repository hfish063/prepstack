from sqlmodel import Session

from app.enums import PhaseType
from app.interviews.phases.models import InterviewPhase
from app.openai.service import generate_questions_for_interview_phase
from app.questions import service as question_service
from app.questions.models import InterviewQuestion
from app.questions.schemas import CustomQuestionAdd, InterviewQuestionCreate


def generate_questions(phase: InterviewPhase) -> list[InterviewQuestionCreate]:
    """Generates questions for provided interview phase."""
    if not supports_questions(phase):
        raise ValueError("Questions are not supported for this interview phase.")

    return generate_questions_for_interview_phase(phase)


def supports_questions(phase: InterviewPhase) -> bool:
    """Checks if the interview phase supports questions.

    i.e. technical phase supports coding problems, not traditional questions.
    """
    return bool(phase.question_count) and phase.phase_type != PhaseType.TECHNICAL


def add_question_to_interview(
    db: Session, phase: InterviewPhase, question_add: CustomQuestionAdd
) -> InterviewQuestion:
    """Add a custom question to a pre-existing interview phase."""
    questions = question_service.get_all_for_phase(db, phase)

    # Place custom questions at the end of the ordinal list
    next_ordinal = 1
    if questions:
        next_ordinal = questions[-1].ordinal + 1

    question_create = InterviewQuestionCreate(text=question_add.text, ordinal=next_ordinal)

    return question_service.save(db, phase, question_create)
