from app.schemas.base import CamelModel


class ProgrammingLanguageRead(CamelModel):
    id: int
    name: str
    extension: str
