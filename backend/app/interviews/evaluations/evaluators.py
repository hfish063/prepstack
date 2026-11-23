from abc import ABC, abstractmethod

from sqlmodel import Session

from app.enums import PhaseType
from app.interviews.evaluations.schemas import (
    CodingEvaluationCreate,
    InterviewPhaseEvaluationCreate,
)
from app.interviews.phases.models import InterviewPhase
from app.questions import service as question_service
from app.messages import service as message_service
from app.openai import service as openai_service
from app.coding_problems import service as coding_service
from app.submissions import service as submission_service
from app.submissions.models import ProblemSubmission


class PhaseEvaluator(ABC):
    def __init__(self, phase: InterviewPhase):
        self.phase = phase

    @abstractmethod
    def evaluate(self, db: Session) -> InterviewPhaseEvaluationCreate:
        pass


class ConversationEvaluator(PhaseEvaluator):
    def evaluate(self, db) -> InterviewPhaseEvaluationCreate:
        questions = question_service.get_all(db, self.phase)
        messages = message_service.get_all_by_phase(db, self.phase)

        if not messages:
            return InterviewPhaseEvaluationCreate(
                score=0, summary="You did not answer any questions for this phase."
            )

        return openai_service.generate_phase_evaluation(self.phase, questions, messages)


class CodingEvaluator(PhaseEvaluator):
    def evaluate(self, db) -> InterviewPhaseEvaluationCreate:
        problem = coding_service.get_coding_problem_by_phase(db, self.phase)
        submissions = submission_service.get_all_submissions(db, self.phase)

        if not submissions:
            return InterviewPhaseEvaluationCreate(
                score=0, summary="You did not submit a solution for the coding problem."
            )

        final_submission = self._select_final_submission(submissions)

        review = openai_service.generate_coding_review(
            self.phase, problem, final_submission, len(submissions)
        )

        return InterviewPhaseEvaluationCreate(
            score=review.score,
            summary=review.summary,
            coding_evaluation=CodingEvaluationCreate(
                time_complexity=review.time_complexity,
                space_complexity=review.space_complexity,
                complexity_reasoning=review.complexity_reasoning,
                submission_id=final_submission.id,
            ),
        )

    def _select_final_submission(
        self, submissions: list[ProblemSubmission]
    ) -> ProblemSubmission:
        accepted = [submission for submission in submissions if submission.accepted]
        return accepted[-1] if accepted else submissions[-1]


def get_evaluator(phase: InterviewPhase) -> PhaseEvaluator:
    if phase.phase_type == PhaseType.TECHNICAL:
        return CodingEvaluator(phase)

    return ConversationEvaluator(phase)
