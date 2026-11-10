import json
from typing import Any

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.judge0.client import (
    poll_submission_batch,
    create_submission_batch,
)
from app.judge0.dependencies import Judge0ExecutionDeps
from app.models.problem_test_case import ProblemTestCase
from app.schemas.code_execution import RunCodeRequest
from app.models.problem_submission import ProblemSubmission
from app.schemas.problem_submission import SubmissionResultRead
from app.services.interview_phase import get_phase_for_user
from app.services.problem_language_template import get_language_template_for_problem
from app.services.problem_test_case import (
    get_example_cases_for_problem,
    get_test_cases_for_problem,
)
from app.services.programming_language import get_programming_language

CANDIDATE_CODE_STUB = "##CANDIDATE_CODE##"


async def run_against_examples(
    deps: Judge0ExecutionDeps,
    user_id: str,
    phase_id: int,
    request: RunCodeRequest,
) -> list[SubmissionResultRead]:
    phase = get_phase_for_user(deps.db, phase_id, user_id)
    language_id = request.language_id
    language_template = get_language_template_for_problem(
        deps.db, phase.coding_problem_id, language_id
    )

    problem_id = phase.coding_problem_id

    examples = get_example_cases_for_problem(deps.db, problem_id)
    if not examples:
        return []

    # Insert the candidate's code into our driver code to ensure it has an execution point
    source_code = _splice_driver_code(
        language_template.driver_code, request.source_code
    )

    results = await _execute_code(deps, source_code, language_id, examples)

    return results


async def submit_candidate_code(
    deps: Judge0ExecutionDeps, user_id: str, phase_id: str, request: RunCodeRequest
) -> ProblemSubmission:
    phase = get_phase_for_user(deps.db, phase_id, user_id)
    template = get_language_template_for_problem(
        deps.db, phase.coding_problem_id, request.language_id
    )
    test_cases = get_test_cases_for_problem(deps.db, phase.coding_problem_id)

    if not test_cases:
        raise HTTPException(
            status_code=400, detail="This problem has no test cases configured."
        )

    source_code = _splice_driver_code(template.driver_code, request.source_code)

    results = await _execute_code(deps, source_code, request.language_id, test_cases)

    submission = ProblemSubmission(
        user_id=user_id,
        problem_id=phase.coding_problem_id,
        language_id=request.language_id,
        phase_id=phase.id,
        source_code=request.source_code,
        accepted=all(result.passed for result in results),
    )

    deps.db.add(submission)

    try:
        deps.db.commit()
    except SQLAlchemyError:
        deps.db.rollback()
        raise

    deps.db.refresh(submission)

    return submission


def _splice_driver_code(driver_code: str, candidate_code: str) -> str:
    return driver_code.replace(CANDIDATE_CODE_STUB, candidate_code)


async def _execute_code(
    deps: Judge0ExecutionDeps,
    source_code: str,
    language_id: int,
    test_cases: list[ProblemTestCase],
) -> list[SubmissionResultRead]:
    if not test_cases:
        return []

    language = get_programming_language(deps.db, language_id)
    judge0_language_id = language.judge0_language_id
    expected_inputs = [json.dumps(case.input) for case in test_cases]

    tokens = await create_submission_batch(
        deps.client, source_code, judge0_language_id, expected_inputs
    )
    judge0_results = await poll_submission_batch(deps.client, tokens)

    results = []
    for test_case, result in zip(test_cases, judge0_results):
        stdout = result.stdout
        actual_output = json.loads(result.stdout) if stdout else None
        passed = _outputs_match(test_case.expected_output, actual_output)

        results.append(
            SubmissionResultRead(
                test_case_id=test_case.id,
                passed=passed,
                output=actual_output,
                stderr=result.stderr,
                compile_output=result.compile_output,
            )
        )

    return results


def _outputs_match(expected: str, actual: Any):
    return expected == actual
