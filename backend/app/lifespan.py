from contextlib import asynccontextmanager

from fastapi import FastAPI
import httpx

from app.config import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.state.judge0_client = httpx.AsyncClient(base_url=settings.JUDGE0_URL)
    yield
    await app.state.judge0_client.aclose()