from typing import Any, Optional

from app.schemas.base import CamelModel


class ProblemSubmissionRead(CamelModel):
    accepted: bool
    total_test_cases: int
    passed_test_cases: Optional[int] = None
    stderr: Optional[str] = None
    compile_output: Optional[str] = None


class SubmissionResultRead(CamelModel):
    test_case_id: int
    passed: bool
    output: Any
    stderr: Optional[str] = None
    compile_output: Optional[str] = None
