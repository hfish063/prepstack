from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from app.enums import PhaseType


class SavedQuestion(SQLModel, table=True):
    __tablename__ = "saved_questions"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    content: str
    phase_type: PhaseType
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))

    tags: list["SavedQuestionTag"] = Relationship()


class SavedQuestionTag(SQLModel, table=True):
    __tablename__ = "saved_question_tags"

    id: Optional[int] = Field(default=None, primary_key=True)
    saved_question_id: int = Field(foreign_key="saved_questions.id", ondelete="CASCADE")
    content: str
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
