from fastapi import APIRouter, Depends
from sqlmodel import Session
from starlette import status

from app.auth.clerk import get_current_user_id
from app.database.database import get_db
from app.questions.saved.schemas import (
    SavedQuestionAnalysisRead,
    SavedQuestionCreate,
    SavedQuestionRead,
)
from app.questions.saved import flows as saved_question_flows
from app.questions.saved import service as saved_question_service

router = APIRouter(prefix="/saved-questions")


@router.get("/all", response_model=list[SavedQuestionRead])
def find_all_saved_questions(
    db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    return saved_question_service.get_all(db, user_id)


@router.get("/{saved_question_id}", response_model=SavedQuestionRead)
def find_saved_question(
    saved_question_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    return saved_question_service.get(db, saved_question_id, user_id)


@router.post("/save", response_model=SavedQuestionRead)
def create_saved_question(
    saved_question_create: SavedQuestionCreate,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    return saved_question_service.save(db, saved_question_create, user_id)


@router.get("/{saved_question_id}/analysis", response_model=SavedQuestionAnalysisRead)
def find_saved_question_analysis(
    saved_question_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    saved_question = saved_question_service.get(db, saved_question_id, user_id)

    return saved_question_flows.get_analysis(db, saved_question)


@router.post(
    "/{saved_question_id}/analyze",
    response_model=SavedQuestionAnalysisRead,
    status_code=status.HTTP_201_CREATED,
)
def analyze_saved_question(
    saved_question_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    saved_question = saved_question_service.get(db, saved_question_id, user_id)

    return saved_question_flows.analyze_question(db, saved_question)


@router.delete("/{saved_question_id}/delete", status_code=status.HTTP_204_NO_CONTENT)
def delete_saved_question(
    saved_question_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    saved_question = saved_question_service.get(db, saved_question_id, user_id)

    saved_question_service.delete(db, saved_question)
