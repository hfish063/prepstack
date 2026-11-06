from datetime import datetime

from app.enums import Difficulty
from app.schemas.base import CamelModel
from app.schemas.problem_example import ProblemExampleRead
from app.schemas.programming_language import ProgrammingLanguageRead


class CodingProblemRead(CamelModel):
    id: int
    title: str
    prompt: str
    difficulty: Difficulty
    time_limit_ms: int
    memory_limit_kb: int
    examples: list[ProblemExampleRead]
    languages: list[
        ProgrammingLanguageRead
    ]  # Languages w/ enabled support for this problem, derived via ProblemLanguageTemplate
    created_at: datetime
    updated_at: datetime
