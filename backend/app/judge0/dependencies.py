from fastapi import Depends, Request
import httpx
from sqlmodel import Session

from app.db.database import get_db


def get_judge0_client(request: Request) -> httpx.AsyncClient:
    return request.app.state.judge0_client


class Judge0ExecutionDeps:
    def __init__(
        self,
        db: Session = Depends(get_db),
        client: httpx.AsyncClient = Depends(get_judge0_client),
    ):
        self.db = db
        self.client = client
