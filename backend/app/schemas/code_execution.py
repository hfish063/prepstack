from app.schemas.base import CamelModel


class RunCodeRequest(CamelModel):
    source_code: str
    language_id: int
