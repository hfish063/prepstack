from fastapi import HTTPException
from openai import OpenAI

from app.config import get_settings
from app.enums import PhaseType
from app.models.interview_phase import InterviewPhase
from app.models.interview_session import InterviewSession
from app.models.message import Message

api_key = get_settings().OPENAI_API_KEY
client = OpenAI(api_key=api_key)
MODEL = "gpt-6-luna"


def generate_response(messages: list[dict]) -> str:
    ai_response = client.chat.completions.create(model=MODEL, messages=messages)

    if not ai_response:
        raise HTTPException(status_code=500, detail="Communication with OpenAI failed.")

    return ai_response
