import json
from typing import Any

from pydantic import BaseModel

from app.judge0.client import (
    poll_submission_batch,
    submit_code_batch,
)
from app.judge0.dependencies import Judge0ExecutionDeps
from app.schemas.code_execution import RunCodeRequest
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


CANDIDATE_CODE_STUB = "##CANDIDATE_CODE##"


async def run_against_examples(
    deps: Judge0ExecutionDeps,
    user_id: str,
    phase_id: int,
    request: RunCodeRequest,
) -> list[ExampleRunResult]:
    phase = get_phase_for_user(deps.db, phase_id, user_id)
    language = get_programming_language(deps.db, request.language_id)
    language_template = get_language_template_for_problem(
        deps.db, phase.coding_problem_id, language.id
    )

    problem_id = phase.coding_problem_id
    judge0_language_id = language.judge0_language_id

    examples = get_examples_for_problem(deps.db, problem_id)
    if not examples:
        return []

    # Insert the candidate's code into our driver code to ensure it has an execution point
    source_code = _splice_driver_code(language_template.driver_code, request.source_code)

    # Run source code against the problem's example test cases 
    example_inputs = [json.dumps(example.input) for example in examples]
    tokens = await submit_code_batch(
        deps.client, source_code, language_id=judge0_language_id, inputs=example_inputs
    )
    token_to_example = dict(zip(tokens, examples))

    submissions = await poll_submission_batch(deps.client, tokens)

    results = []
    for submission in submissions:
        example = token_to_example[submission.token]

        # Check for runtime and compile errors
        if submission.stderr or submission.stdout is None:
            results.append(
                ExampleRunResult(
                    example_id=example.id,
                    passed=False,
                    actual_output=None,
                    stderr=submission.stderr,
                    compile_output=submission.compile_output,
                )
            )
        else:
            output = json.loads(submission.stdout)
            passed = output == example.expected_output
            results.append(
                ExampleRunResult(
                    example_id=example.id,
                    passed=passed,
                    actual_output=output,
                    stderr=submission.stderr,
                    compile_output=submission.compile_output,
                )
            )

    return results


def _splice_driver_code(driver_code: str, candidate_code: str) -> str:
    return driver_code.replace(CANDIDATE_CODE_STUB, candidate_code)
