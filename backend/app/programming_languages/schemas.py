from app.schemas import CamelModel


class ProgrammingLanguageRead(CamelModel):
    id: int
    name: str
    extension: str
