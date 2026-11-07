from app.schemas.base import CamelModel


class ProblemLanguageTemplateRead(CamelModel):
    id: int
    starter_code: str
