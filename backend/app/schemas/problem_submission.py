from app.schemas.base import CamelModel


class ProblemSubmissionCreate(CamelModel):
    problem_id: int
    language_id: int
    source_code: str
