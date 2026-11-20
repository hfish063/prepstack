from pydantic import Field

from app.schemas import CamelModel


class InterviewSummaryRead(CamelModel):
    overall_score: int = Field(ge=0, le=100)
    summary: str
    phase_evaluations: list[InterviewPhaseEvaluationRead]


class InterviewPhaseEvaluationRead(CamelModel):
    score: int = Field(ge=0, le=100)
    summary: str


class InterviewSummaryCreate(CamelModel):
    overall_score: int = Field(ge=0, le=100)
    summary: str


class InterviewPhaseEvaluationCreate(CamelModel):
    score: int = Field(ge=0, le=100)
    summary: str
