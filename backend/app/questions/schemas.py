from app.schemas import CamelModel


class InterviewQuestionRead(CamelModel):
    id: int
    phase_id: int
    text: str
    ordinal: int


class InterviewQuestionCreate(CamelModel):
    phase_id: int
    text: str
    ordinal: int
