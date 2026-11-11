import json
from typing import Any

from sqlmodel import Session

from app.coding_problems.models import CodingProblem
from app.exceptions import ResourceNotFoundError
from app.coding_problems.exceptions import (
    NoTestCasesConfiguredError,
)
from app.coding_problems.schemas import CodingProblemRead, RunCodeRequest
from app.language_templates.service import get_language_template_for_problem
from app.programming_languages.service import (
    get_available_languages_for_problem,
    get_programming_language,
)
from app.test_cases.models import ProblemTestCase
from app.test_cases.service import (
    get_example_cases_for_problem,
    get_test_cases_for_problem,
)
from app.judge0.client import (
    poll_submission_batch,
    create_submission_batch,
)
from app.judge0.dependencies import Judge0ExecutionDeps
from app.submissions import service as submissions_service
from app.submissions.schemas import ProblemSubmissionRead, SubmissionResultRead
from app.interviews.phases.service import get_phase_for_user

CANDIDATE_CODE_STUB = "##CANDIDATE_CODE##"


def get_coding_problem_details(
    db: Session, problem: CodingProblem
) -> CodingProblemRead:
    examples = get_example_cases_for_problem(db, problem.id)
    languages = get_available_languages_for_problem(db, problem.id)

    return CodingProblemRead(
        **problem.model_dump(), examples=examples, languages=languages
    )


async def run_against_examples(
    deps: Judge0ExecutionDeps,
    user_id: str,
    phase_id: int,
    request: RunCodeRequest,
) -> list[SubmissionResultRead]:
    """Runs candidate code against the non-hidden (example) test cases

    Ephemeral process, results are not persisted to the database at any stage.
    """
    phase = get_phase_for_user(deps.db, phase_id, user_id)

    if not phase:
        raise ResourceNotFoundError("Could not find phase for this user.")

    language_id = request.language_id
    problem_id = phase.coding_problem_id

    template = _get_language_template(deps.db, problem_id, language_id)

    examples = get_example_cases_for_problem(deps.db, problem_id)
    if not examples:
        return []

    # Insert the candidate's code into our driver code to ensure it has an execution point
    source_code = _splice_driver_code(template.driver_code, request.source_code)

    results = await _execute_code(deps, source_code, language_id, examples)

    return results


async def submit_candidate_code(
    deps: Judge0ExecutionDeps, user_id: str, phase_id: int, request: RunCodeRequest
) -> ProblemSubmissionRead:
    """Runs candidate code against all test cases for the problem."""
    phase = get_phase_for_user(deps.db, phase_id, user_id)

    if not phase:
        raise ResourceNotFoundError("Could not find phase for this user.")

    template = _get_language_template(
        deps.db, phase.coding_problem_id, request.language_id
    )

    test_cases = get_test_cases_for_problem(deps.db, phase.coding_problem_id)

    if not test_cases:
        raise NoTestCasesConfiguredError("This problem has no test cases configured.")

    source_code = _splice_driver_code(template.driver_code, request.source_code)

    results = await _execute_code(deps, source_code, request.language_id, test_cases)
    stderr, compile_err = _get_submission_errors(results)

    submission = submissions_service.create_submission(
        deps.db,
        user_id=user_id,
        problem_id=phase.coding_problem_id,
        language_id=request.language_id,
        phase_id=phase.id,
        source_code=request.source_code,
        accepted=all(result.passed for result in results),
    )

    passed_cases = sum(1 for result in results if result.passed == True)
    return ProblemSubmissionRead(
        accepted=submission.accepted,
        total_test_cases=len(test_cases),
        passed_test_cases=passed_cases,
        stderr=stderr,
        compile_output=compile_err,
    )


def _get_language_template(db: Session, problem_id, language_id):
    template = get_language_template_for_problem(db, problem_id, language_id)

    if not template:
        raise ResourceNotFoundError(
            "This problem has no language templates configured."
        )

    return template


def _splice_driver_code(driver_code: str, candidate_code: str) -> str:
    if CANDIDATE_CODE_STUB not in driver_code:
        raise ValueError("Driver code is missing the candidate code placeholder.")

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

    expected_inputs = [json.dumps(case.input) for case in test_cases]

    tokens = await create_submission_batch(
        deps.client, source_code, language.judge0_language_id, expected_inputs
    )

    judge0_results = await poll_submission_batch(deps.client, tokens)

    if len(judge0_results) != len(test_cases):
        raise RuntimeError(
            "Judge0 returned an unexpected number of submission results."
        )

    results = []
    for test_case, result in zip(test_cases, judge0_results):
        actual_output = None

        if result.stdout:
            try:
                actual_output = json.loads(result.stdout)
            except json.JSONDecodeError:
                pass

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


def _outputs_match(expected: str, actual: Any) -> bool:
    return expected == actual


def _get_submission_errors(
    results: list[SubmissionResultRead],
) -> tuple[str | None, str | None]:
    for result in results:
        if result.stderr or result.compile_output:
            return (result.stderr, result.compile_output)

    return (None, None)
