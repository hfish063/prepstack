import json
import logging
from typing import Type, TypeVar

from openai import OpenAI
from openai.types.chat import ChatCompletionMessageParam
from pydantic import BaseModel

from app.config import get_settings
from app.openai.prompts.context import PromptContext

logger = logging.getLogger(__name__)


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
        context: PromptContext | None = None,
        history: list[ChatCompletionMessageParam] | None = None,
    ) -> str | None:
        """OpenAI chat completion API endpoint.

        Args:
            prompt: the user's message to the AI model
            context: dynamic data about the conversation
            history: conversation history
        """
        client = OpenAI(api_key=self.api_key)

        messages: list[ChatCompletionMessageParam] = [
            {"role": "system", "content": self.system_message},
            *(history or []),
        ]

        if context:
            messages.append(
                {
                    "role": "user",
                    "content": f"<context>{context.model_dump_json()}</context>",
                }
            )

        if prompt:
            messages.append({"role": "user", "content": prompt})

        try:
            completion = client.chat.completions.create(
                model=self.model,
                messages=messages,
            )
        except Exception as e:
            logger.error(e)
            raise

        return completion.choices[0].message.content

    def chat_json_parse(
        self,
        prompt: str | None = None,
        context: PromptContext | None = None,
        history: list[ChatCompletionMessageParam] | None = None,
    ) -> dict:
        """Returns a JSON loaded OpenAI response model.

        Args:
            prompt: the user's message to the AI model
            context: dynamic data about the conversation
            history: conversation history
        """
        client = OpenAI(api_key=self.api_key)

        messages: list[ChatCompletionMessageParam] = [
            {"role": "system", "content": self.system_message},
            *(history or []),
        ]

        if context:
            messages.append(
                {
                    "role": "user",
                    "content": f"<context>{context.model_dump_json()}</context>",
                }
            )

        if prompt:
            messages.append({"role": "user", "content": prompt})

        try:
            completion = client.chat.completions.create(
                model=self.model,
                response_format={"type": "json_object"},
                messages=messages,
            )
        except Exception as e:
            logger.error(e)
            raise

        return json.loads(completion.choices[0].message.content)

    T = TypeVar("T", bound=BaseModel)

    def chat_parse(
        self,
        context: PromptContext,
        response_model: Type[T],
    ) -> T | None:
        client = OpenAI(api_key=self.api_key)

        try:
            completion = client.chat.completions.parse(
                model=self.model,
                response_format=response_model,
                messages=[
                    {"role": "system", "content": self.system_message},
                    {
                        "role": "user",
                        "content": f"<context>{context.model_dump_json()}</context>",
                    },
                ],
            )
        except Exception as e:
            logger.error(e)
            raise

        message = completion.choices[0].message

        if message.refusal:
            logger.warning("OpenAI refused structured response: %s", message.refusal)
            return None

        return message.parsed
