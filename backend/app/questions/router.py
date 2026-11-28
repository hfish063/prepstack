from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth.clerk import get_current_user_id
from app.database.database import get_db
from app.interviews.phases import service as phase_service
from app.messages.schemas import MessageCreate, MessageRead
from app.questions import service as question_service
from app.messages import service as message_service
from app.messages import flows as message_flows
from app.questions import flows as question_flows
from app.questions.schemas import CustomQuestionAdd, InterviewQuestionRead

router = APIRouter(prefix="/questions")


@router.get("/{phase_id}/all", response_model=list[InterviewQuestionRead])
def get_questions_for_phase(
    phase_id: int, db: Session = Depends(get_db), user_id=Depends(get_current_user_id)
):
    phase = phase_service.get_phase_for_user(db, phase_id, user_id)

    return question_service.get_all_for_phase(db, phase)


@router.get("/{question_id}", response_model=InterviewQuestionRead)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    return question_service.get_for_user(db, question_id, user_id)


@router.get("/{question_id}/messages", response_model=list[MessageRead])
def get_messages_for_question(
    question_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    question = question_service.get_for_user(db, question_id, user_id)

    return message_service.get_all_by_question(db, question)


@router.post("/{question_id}/messages", response_model=MessageRead)
def create_message_for_question(
    question_id: int,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    question = question_service.get_mutable_for_user(db, question_id, user_id)

    return message_flows.process_message(db, question, payload.content)


@router.post("/{phase_id}", response_model=InterviewQuestionRead)
def create_question(
    phase_id: int,
    custom_question: CustomQuestionAdd,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    phase = phase_service.get_phase_for_user(db, phase_id, user_id)

    return question_flows.add_question_to_interview(db, phase, custom_question)


@router.post("/{question_id}/hints", response_model=MessageRead)
def create_hint_for_question(
    question_id: int,
    db: Session = Depends(get_db),
    user_id=Depends(get_current_user_id),
):
    question = question_service.get_mutable_for_user(db, question_id, user_id)

    return message_flows.request_hint(db, question)
