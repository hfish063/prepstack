from typing import Any, Optional

from app.schemas.base import CamelModel


class ProblemExampleRead(CamelModel):
    id: int
    input: dict
    expected_output: Any
    explanation: Optional[str] = None
    ordinal: int
