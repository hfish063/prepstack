from openai import OpenAI

from app.config import get_settings


api_key = get_settings().OPENAI_API_KEY
client = OpenAI(api_key)
MODEL = "gpt-6-luna"

def generate_response():
    pass