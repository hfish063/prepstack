from app.interviews.evaluations.models import InterviewPhaseEvaluation, InterviewSummary
from app.interviews.evaluations.schemas import (
    CodingEvaluationRead,
    InterviewPhaseEvaluationRead,
    InterviewStatsRead,
    InterviewSummaryRead,
)
from app.submissions.schemas import SubmissionStatsRead


def to_summary_read(
    summary: InterviewSummary,
    evaluations: list[InterviewPhaseEvaluation],
    interview_stats: InterviewStatsRead,
    submission_stats: SubmissionStatsRead,
) -> InterviewSummaryRead:
    return InterviewSummaryRead(
        overall_score=summary.overall_score,
        summary=summary.summary,
        stats=interview_stats,
        feedback=summary.feedback,
        phase_evaluations=[
            InterviewPhaseEvaluationRead(
                score=evaluation.score,
                summary=evaluation.summary,
                phase_id=evaluation.phase_id,
                phase_type=evaluation.phase.phase_type,
                coding_evaluation=_to_coding_evaluation_read(
                    evaluation, submission_stats
                ),
            )
            for evaluation in evaluations
        ],
    )


def _to_coding_evaluation_read(
    evaluation: InterviewPhaseEvaluation, submission_stats: SubmissionStatsRead
) -> CodingEvaluationRead | None:
    coding_evaluation = evaluation.coding_evaluation

    if not coding_evaluation:
        return None

    return CodingEvaluationRead(
        time_complexity=coding_evaluation.time_complexity,
        space_complexity=coding_evaluation.space_complexity,
        complexity_reasoning=coding_evaluation.complexity_reasoning,
        submission=coding_evaluation.submission,
        submission_stats=submission_stats,
    )
