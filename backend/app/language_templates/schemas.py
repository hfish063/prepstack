from app.schemas import CamelModel


class ProblemLanguageTemplateRead(CamelModel):
    id: int
    starter_code: str
