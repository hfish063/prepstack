from sqlmodel import Session

from app.enums import InterviewStatus
from app.exceptions import ResourceConflictError
from app.interviews.evaluations.models import InterviewSummary, InterviewPhaseEvaluation
from app.interviews.evaluations import service as evaluation_service
from app.interviews.sessions.models import InterviewSession
from app.interviews.phases import service as phase_service
from app.openai import service as openai_service
from app.messages import service as message_service


def evaluate_interview(db: Session, interview: InterviewSession) -> InterviewSummary:
    if interview.status != InterviewStatus.COMPLETED:
        raise ResourceConflictError(
            "Cannot generate evaluations for incomplete interviews"
        )
    if evaluation_service.get_summary_by_interview(db, interview):
        raise ResourceConflictError("This interview has already been evaluated.")

    phases = phase_service.get_phases_for_interview(db, interview)

    messages = message_service.get_all_by_phases(db, phases)

    messages_for_phases = {}
    for message in messages:
        messages_for_phases[message.phase_id] = message

    transcripts_for_phases = {}
    for phase in messages_for_phases:
        transcripts_for_phases[phase.id] = messages_for_phases[phase].content

    phase_evaluations = []
    for phase in phases:
        evaluation = openai_service.generate_phase_evaluation(phase, transcripts_for_phases[phase.id])
        phase_evaluations.append(evaluation)

    if not phase_evaluations:
        return

    interview_summary = openai_service.generate_interview_summary(interview, phase_evaluations)

    if not interview_summary:
        return

    