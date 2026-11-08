from typing import Any

from app.schemas.base import CamelModel


class ProblemTestCaseRead(CamelModel):
    input: dict
    expected_output: Any
