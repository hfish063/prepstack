import tiktoken

from app.messages.models import Message

MAX_HISTORY_TOKENS = 4000
MAX_COMPLETION_TOKENS = 800


class OpenAIContextManager:
    def __init__(
        self,
        model: str,
        max_history_tokens: int = MAX_HISTORY_TOKENS,
        max_completion_tokens: int = MAX_COMPLETION_TOKENS,
    ):
        self.model = model
        try:
            self.encoding = tiktoken.encoding_for_model(model)
        except KeyError:
            self.encoding = tiktoken.get_encoding("cl100k_base")
        self.max_history_tokens = max_history_tokens
        self.max_completion_tokens = max_completion_tokens

    def count_tokens(self, message: str) -> int:
        return len(self.encoding.encode(message))

    def select_history(self, history: list[Message]) -> list[Message]:
        total_tokens = 0
        results = []

        for message in reversed(history):
            num_tokens = self.count_tokens(message.content)
            total_tokens += num_tokens

            if total_tokens >= self.max_history_tokens:
                break

            results.append(message)

        return results
