from typing import Optional

from pydantic import Field

from app.enums import FeedbackType, PhaseType
from app.schemas import CamelModel
from app.submissions.schemas import ProblemSubmissionHistoryRead, SubmissionStatsRead


class InterviewSummaryRead(CamelModel):
    overall_score: int = Field(ge=0, le=100)
    summary: str
    stats: InterviewStatsRead
    phase_evaluations: list[InterviewPhaseEvaluationRead]
    feedback: list[InterviewFeedbackRead]


class InterviewStatsRead(CamelModel):
    answered_questions: int
    total_questions: int
    message_count: int
    hints_used: int


class InterviewPhaseEvaluationRead(CamelModel):
    score: int = Field(ge=0, le=100)
    summary: str
    phase_id: int
    phase_type: PhaseType
    coding_evaluation: Optional["CodingEvaluationRead"] = None


class CodingEvaluationRead(CamelModel):
    time_complexity: str
    space_complexity: str
    complexity_reasoning: str
    submission: ProblemSubmissionHistoryRead
    submission_stats: SubmissionStatsRead


class InterviewSummaryCreate(CamelModel):
    overall_score: int = Field(ge=0, le=100)
    summary: str
    feedback: list[InterviewFeedbackCreate]


class InterviewPhaseEvaluationCreate(CamelModel):
    score: int = Field(ge=0, le=100)
    summary: str
    coding_evaluation: Optional["CodingEvaluationCreate"] = None


class CodingEvaluationCreate(CamelModel):
    time_complexity: str
    space_complexity: str
    complexity_reasoning: str
    submission_id: int


class InterviewFeedbackRead(CamelModel):
    type: FeedbackType
    content: str


class InterviewFeedbackCreate(CamelModel):
    type: FeedbackType
    content: str
