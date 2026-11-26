from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from app.enums import FeedbackType
from app.interviews.phases.models import InterviewPhase
from app.submissions.models import ProblemSubmission


class InterviewSummary(SQLModel, table=True):
    __tablename__ = "interview_summaries"
    id: Optional[int] = Field(default=None, primary_key=True)
    interview_id: int = Field(
        foreign_key="interview_sessions.id", unique=True, ondelete="CASCADE"
    )
    overall_score: int = Field(ge=0, le=100)
    summary: str

    feedback: list["InterviewFeedback"] = Relationship()


class InterviewPhaseEvaluation(SQLModel, table=True):
    __tablename__ = "interview_phase_evaluations"
    id: Optional[int] = Field(default=None, primary_key=True)
    phase_id: int = Field(
        foreign_key="interview_phases.id", unique=True, ondelete="CASCADE"
    )
    score: int = Field(ge=0, le=100)
    summary: str

    phase: InterviewPhase = Relationship()
    coding_evaluation: Optional["CodingEvaluation"] = Relationship()


class CodingEvaluation(SQLModel, table=True):
    __tablename__ = "coding_evaluations"
    id: Optional[int] = Field(default=None, primary_key=True)
    phase_evaluation_id: int = Field(
        foreign_key="interview_phase_evaluations.id",
        unique=True,
        ondelete="CASCADE",
    )
    submission_id: int = Field(foreign_key="problem_submissions.id", ondelete="CASCADE")
    time_complexity: str
    space_complexity: str
    complexity_reasoning: str

    submission: ProblemSubmission = Relationship()


class InterviewFeedback(SQLModel, table=True):
    __tablename__ = "interview_feedback"

    id: Optional[int] = Field(default=None, primary_key=True)
    summary_id: int = Field(
        foreign_key="interview_summaries.id", ondelete="CASCADE", index=True
    )
    type: FeedbackType
    content: str
