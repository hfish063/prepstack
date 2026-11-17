from datetime import datetime

from app.enums import MessageKind, MessageRole
from app.schemas import CamelModel


class MessageCreate(CamelModel):
    content: str


class MessageRead(CamelModel):
    id: int
    phase_id: int
    question_id: int
    role: MessageRole
    kind: MessageKind
    content: str
    created_at: datetime
