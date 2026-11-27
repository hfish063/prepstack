import logging
import time

from fastapi import HTTPException
import httpx
from pydantic import TypeAdapter

from app.judge0.response import Judge0Response

MAX_POLL_ATTEMPTS = 15
POLLING_INTERVAL_SECONDS = 1
IN_PROGRESS_STATUSES = {1, 2}  # 1 (In Queue), 2 (Processing)

_batch_adapter = TypeAdapter(list[Judge0Response])

log = logging.getLogger(__name__)


def create_submission_batch(
    client: httpx.Client, source_code: str, language_id: int, inputs: list[str]
) -> list[str]:
    if not inputs:
        raise ValueError("At least one test case is required.")

    response = client.post(
        "/submissions/batch",
        json={
            "submissions": [
                {"language_id": language_id, "source_code": source_code, "stdin": stdin}
                for stdin in inputs
            ]
        },
    )
    response.raise_for_status()
    data = response.json()

    return [result["token"] for result in data]


def poll_submission_batch(
    client: httpx.Client, tokens: list[str]
) -> list[Judge0Response]:
    for _ in range(MAX_POLL_ATTEMPTS):
        submissions = _get_submission_batch(client, tokens)

        if any(
            submission.status.id in IN_PROGRESS_STATUSES for submission in submissions
        ):
            time.sleep(POLLING_INTERVAL_SECONDS)
            continue

        return submissions

    log.warning(
        f"Judge0 batch did not complete after {MAX_POLL_ATTEMPTS} polls: {tokens}"
    )

    raise HTTPException(
        status_code=504,
        detail=f"Judge0 submissions did not complete within {MAX_POLL_ATTEMPTS * POLLING_INTERVAL_SECONDS}s.",
    )


def _get_submission_batch(
    client: httpx.Client, tokens: list[str]
) -> list[Judge0Response]:
    response = client.get(f"/submissions/batch", params={"tokens": ",".join(tokens)})
    response.raise_for_status()
    data = response.json()

    submissions = _batch_adapter.validate_python(data["submissions"])

    if len(submissions) != len(tokens):
        log.error(
            f"Judge0 returned {len(submissions)} submissions for {len(tokens)} tokens"
        )
        raise HTTPException(
            status_code=502,
            detail="Judge0 returned an unexpected number of submissions",
        )

    return submissions
