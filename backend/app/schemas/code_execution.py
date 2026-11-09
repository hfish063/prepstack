from typing import Any

from app.schemas.base import CamelModel


class RunCodeRequest(CamelModel):
    source_code: str
    language_id: int


class ExampleRunResultRead(CamelModel):
    example_id: int
    passed: bool
    stderr: str | None = None
    compile_output: str | None = None
    actual_output: Any
