import asyncio

from fastapi import HTTPException
import httpx
from pydantic import TypeAdapter

from app.config import get_settings
from app.judge0.response import Judge0Response

MAX_POLL_ATTEMPTS = 15
POLLING_INTERVAL_SECONDS = 1
IN_PROGRESS_STATUSES = {1, 2}  # 1 (In Queue), 2 (Processing)

_batch_adapter = TypeAdapter(list[Judge0Response])


async def submit_code_batch(
    client: httpx.AsyncClient, source_code: str, language_id: int, inputs: list[str]
) -> list[str]:
    if not inputs:
        raise ValueError("At least one test case is required.")

    response = await client.post(
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


async def poll_submission_batch(
    client: httpx.AsyncClient, tokens: list[str]
) -> list[Judge0Response]:
    for _ in range(MAX_POLL_ATTEMPTS):
        submissions = await _get_submission_batch(client, tokens)

        if any(
            submission.status.id in IN_PROGRESS_STATUSES for submission in submissions
        ):
            await asyncio.sleep(POLLING_INTERVAL_SECONDS)
            continue

        return submissions

    raise HTTPException(
        status_code=504,
        detail=f"Judge0 submissions did not complete within {MAX_POLL_ATTEMPTS * POLLING_INTERVAL_SECONDS}s.",
    )


async def _get_submission_batch(
    client: httpx.AsyncClient, tokens: list[str]
) -> list[Judge0Response]:
    response = await client.get(
        f"/submissions/batch", params={"tokens": ",".join(tokens)}
    )
    response.raise_for_status()
    data = response.json()

    submissions = _batch_adapter.validate_python(data["submissions"])

    if len(submissions) != len(tokens):
        raise HTTPException(
            status_code=502,
            detail="Judge0 returned an unexpected number of submissions",
        )

    return submissions
