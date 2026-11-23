from datetime import datetime
from typing import Any, Optional

from app.programming_languages.schemas import ProgrammingLanguageRead
from app.schemas import CamelModel


class ProblemSubmissionSummaryRead(CamelModel):
    accepted: bool
    total_test_cases: int
    passed_test_cases: Optional[int] = None
    stderr: Optional[str] = None
    compile_output: Optional[str] = None


class ProblemSubmissionCreate(CamelModel):
    problem_id: int
    language_id: int
    phase_id: int
    source_code: str
    accepted: bool
    total_test_cases: int
    passed_test_cases: int
    accepted: bool


class SubmissionResultRead(CamelModel):
    test_case_id: int
    passed: bool
    output: Any
    stderr: Optional[str] = None
    compile_output: Optional[str] = None


class ProblemSubmissionHistoryRead(CamelModel):
    id: int
    problem_id: int
    language_id: int
    language: ProgrammingLanguageRead
    phase_id: int
    source_code: str
    total_test_cases: int
    passed_test_cases: int
    accepted: bool
    created_at: datetime
    updated_at: datetime
