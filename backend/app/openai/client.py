import json

from openai import APIError, OpenAI
from openai.types.chat import ChatCompletionMessageParam

from app.config import get_settings


class OpenAIClient:
    def __init__(
        self,
        system_message: str,
        model: str = "gpt-6-luna",
    ):
        self.api_key = get_settings().OPENAI_API_KEY
        self.system_message = system_message
        self.model = model

    def chat_completion(
        self,
        prompt: str | None = None,
        history: list[ChatCompletionMessageParam] | None = None,
    ) -> str | None:
        client = OpenAI(api_key=self.api_key)

        messages: list[ChatCompletionMessageParam] = [
            {"role": "system", "content": self.system_message},
            *(history or []),
        ]

        if prompt:
            messages.append({"role": "user", "content": prompt})

        try:
            completion = client.chat.completions.create(
                model=self.model,
                messages=messages,
            )
        except APIError:
            raise

        return completion.choices[0].message.content

    def chat_json_parse(
        self,
        prompt: str | None = None,
        history: list[ChatCompletionMessageParam] | None = None,
    ) -> dict:
        """Returns a JSON loaded OpenAI response model.

        Optional args provide a user prompt and message history for the OpenAI generation context.

        If these are not provided, the chat completion will be based on the client's
        system prompt alone.
        """
        client = OpenAI(api_key=self.api_key)

        messages: list[ChatCompletionMessageParam] = [
            {"role": "system", "content": self.system_message},
            *(history or []),
        ]

        if prompt:
            messages.append({"role": "user", "content": prompt})

        try:
            completion = client.chat.completions.create(
                model=self.model,
                response_format={"type": "json_object"},
                messages=messages,
            )
        except APIError:
            raise

        return json.loads(completion.choices[0].message.content)
