from typing import Any, Optional

from app.schemas import CamelModel


class ProblemExampleRead(CamelModel):
    id: int
    input: dict
    expected_output: Any
    explanation: Optional[str] = None
    ordinal: int


class ProblemTestCaseRead(CamelModel):
    input: dict
    expected_output: Any
