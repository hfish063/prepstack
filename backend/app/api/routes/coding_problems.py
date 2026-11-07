from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user_id
from app.db.database import get_db
from app.schemas.base import CamelModel
from app.services.code_execution import ExampleRunResultRead, run_against_examples


class RunCodeRequest(CamelModel):
    source_code: str
    language_id: int


router = APIRouter(prefix="/coding-problems")


@router.post("/{phase_id}/run")
async def run_code(
    phase_id: int,
    run_code_request: RunCodeRequest,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
) -> list[ExampleRunResultRead]:
    return await run_against_examples(
        db,
        user_id,
        phase_id,
        run_code_request.source_code,
        run_code_request.language_id,
    )
