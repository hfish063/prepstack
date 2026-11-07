import json
from typing import Any, Optional

from pydantic import BaseModel
from sqlmodel import Session

from app.judge0.client import poll_submission, submit_code
from app.schemas.base import CamelModel
from app.services.interview_phase import get_phase_for_user
from app.services.problem_example import get_examples_for_problem
from app.services.problem_language_template import get_language_template_for_problem
from app.services.programming_language import get_programming_language


class ExampleRunResult(BaseModel):
    example_id: int
    passed: bool
    actual_output: Any
    stderr: str | None = None
    compile_output: str | None = None


class ExampleRunResultRead(CamelModel):
    example_id: int
    passed: bool
    actual_output: Any


CANDIDATE_CODE_STUB = "##CANDIDATE_CODE##"


async def run_against_examples(
    db: Session, user_id: str, phase_id: int, candidate_code: str, language_id: int
) -> list[ExampleRunResult]:
    phase = get_phase_for_user(db, phase_id, user_id)
    language = get_programming_language(db, language_id)
    language_template = get_language_template_for_problem(
        db, phase.coding_problem_id, language.id
    )

    problem_id = phase.coding_problem_id
    judge0_language_id = language.judge0_language_id

    examples = get_examples_for_problem(db, problem_id)
    if not examples:
        return []

    source_code = _splice_driver_code(language_template.driver_code, candidate_code)

    results = []
    for example in examples:
        input = example.input
        token = await submit_code(
            source_code, stdin=json.dumps(input), language_id=judge0_language_id
        )

        result = await poll_submission(token)

        # Check for runtime and compile errors
        if result.stderr or result.stdout is None:
            results.append(
                ExampleRunResult(
                    example_id=example.id,
                    passed=False,
                    actual_output=None,
                    stderr=result.stderr,
                    compile_output=result.compile_output,
                )
            )
        else:
            output = json.loads(result.stdout)
            passed = output == example.expected_output
            results.append(
                ExampleRunResult(
                    example_id=example.id,
                    passed=passed,
                    actual_output=output,
                    stderr=result.stderr,
                    compile_output=result.compile_output,
                )
            )

    return results


def _splice_driver_code(driver_code: str, candidate_code: str) -> str:
    return driver_code.replace(CANDIDATE_CODE_STUB, candidate_code)
