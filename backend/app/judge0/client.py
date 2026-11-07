import asyncio

from fastapi import HTTPException
import httpx

from app.config import get_settings
from app.judge0.response import Judge0Response

settings = get_settings()
client = httpx.AsyncClient(base_url=settings.JUDGE0_URL)

MAX_POLL_ATTEMPTS = 15
POLLING_INTERVAL_SECONDS = 1
IN_PROGRESS_STATUSES = {1, 2}  # 1 (In Queue), 2 (Processing)


async def submit_code(source_code, stdin, language_id) -> str:
    response = await client.post(
        "/submissions",
        json={"source_code": source_code, "language_id": language_id, "stdin": stdin},
    )
    response.raise_for_status()
    data = response.json()

    return data["token"]


async def get_submission(token: str) -> Judge0Response:
    response = await client.get(f"/submissions/{token}")
    response.raise_for_status()
    data = response.json()

    return Judge0Response.model_validate(data)


async def poll_submission(token: str) -> Judge0Response:
    for _ in range(MAX_POLL_ATTEMPTS):
        response = await get_submission(token)

        if response.status.id in IN_PROGRESS_STATUSES:
            await asyncio.sleep(POLLING_INTERVAL_SECONDS)
            continue

        return response

    raise HTTPException(
        status_code=504,
        detail=f"Judge0 submission {token} did not complete within {MAX_POLL_ATTEMPTS * POLLING_INTERVAL_SECONDS}s.",
    )
