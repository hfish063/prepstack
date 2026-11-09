from enum import Enum


class InterviewStatus(Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class PhaseType(Enum):
    BEHAVIORAL = "behavioral"
    CONCEPTUAL = "conceptual"
    TECHNICAL = "technical"


class PhaseStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class MessageRole(Enum):
    USER = "user"
    SYSTEM = "system"
    ASSISTANT = "assistant"


class Difficulty(Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class SubmissionStatus(Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    WRONG_ANSWER = "wrong_answer"
    TIME_LIMIT_EXCEEDED = "time_limit_exceeded"
    RUNTIME_ERROR = "runtime_error"
    COMPILE_ERROR = "compile_error"
    MEMORY_LIMIT_EXCEEDED = "memory_limit_exceeded"
