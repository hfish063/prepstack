from datetime import datetime
from typing import Any

from app.enums import Difficulty
from app.schemas import CamelModel
from app.test_cases.schemas import ProblemExampleRead
from app.programming_languages.schemas import ProgrammingLanguageRead


class CodingProblemRead(CamelModel):
    id: int
    title: str
    prompt: str
    difficulty: Difficulty
    examples: list[ProblemExampleRead]
    languages: list[
        ProgrammingLanguageRead
    ]  # Languages w/ enabled support for this problem, derived via ProblemLanguageTemplate
    created_at: datetime
    updated_at: datetime


class RunCodeRequest(CamelModel):
    source_code: str
    language_id: int


class ExampleRunResultRead(CamelModel):
    example_id: int
    passed: bool
    stderr: str | None = None
    compile_output: str | None = None
    actual_output: Any
