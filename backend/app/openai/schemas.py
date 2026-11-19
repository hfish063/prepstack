from pydantic import BaseModel, Field


class InterviewPhaseEvaluationResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    summary: str


class InterviewSummaryResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    summary: str