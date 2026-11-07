from fastapi import Request
import httpx


def get_judge0_client(request: Request) -> httpx.AsyncClient:
    return request.app.state.judge0_client
