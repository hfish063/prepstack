from fastapi import HTTPException
from openai import APIError, OpenAI

from app.config import get_settings

api_key = get_settings().OPENAI_API_KEY
client = OpenAI(api_key=api_key)
MODEL = "gpt-6-luna"


def generate_response(messages: list[dict]) -> str:
    try:
        ai_response = client.chat.completions.create(model=MODEL, messages=messages)
    except APIError:
        raise HTTPException(status_code=502, detail="Communication with OpenAI failed.")

    return ai_response.choices[0].message.content
