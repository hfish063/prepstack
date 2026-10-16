from datetime import datetime

from app.enums import MessageRole
from app.schemas.base import CamelModel


class MessageCreate(CamelModel):
    content: str


class MessageRead(CamelModel):
    id: int
    phase_id: int
    role: MessageRole
    content: str
    created_at: datetime
