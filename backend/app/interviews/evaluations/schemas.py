from app.schemas import CamelModel


class InterviewSummaryRead(CamelModel):
    overall_score: int
    summary: str
    phase_evaluations: list[InterviewPhaseEvaluationRead]


class InterviewPhaseEvaluationRead(CamelModel):
    score: int
    summary: str