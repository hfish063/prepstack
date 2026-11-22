from pydantic import BaseModel, Field


class InterviewPhaseEvaluationResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    summary: str


class InterviewSummaryResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    summary: str


class CodingEvaluationResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    summary: str
    time_complexity: str
    space_complexity: str
    complexity_reasoning: str
