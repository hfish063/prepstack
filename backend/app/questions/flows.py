from app.enums import PhaseType
from app.interviews.phases.models import InterviewPhase
from app.openai.service import generate_questions_for_interview_phase
from app.questions.schemas import InterviewQuestionCreate


def generate_questions(phase: InterviewPhase) -> list[InterviewQuestionCreate]:
    """Generates questions for provided interview phase."""
    if not supports_questions(phase):
        raise ValueError("Questions are not supported for this interview phase.")

    return generate_questions_for_interview_phase(phase)


def supports_questions(phase: InterviewPhase) -> bool:
    """Checks if the interview phase supports questions.

    I.e. technical phase supports coding problems, not traditional questions.
    """
    return bool(phase.question_count) and phase.phase_type != PhaseType.TECHNICAL
