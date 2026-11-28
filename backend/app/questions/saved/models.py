from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel

from app.enums import PhaseType


class SavedQuestion(SQLModel, table=True):
    __tablename__ = "saved_questions"
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "source_question_id",
            name="uq_saved_questions_user_id_source_question_id",
        ),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    # Interview question this was saved from; kept when the interview is deleted
    source_question_id: Optional[int] = Field(
        default=None, foreign_key="interview_questions.id", ondelete="SET NULL"
    )
    content: str
    phase_type: PhaseType
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    tags: list["SavedQuestionTag"] = Relationship(passive_deletes=True)
    analysis: Optional["SavedQuestionAnalysis"] = Relationship(passive_deletes=True)


class SavedQuestionTag(SQLModel, table=True):
    __tablename__ = "saved_question_tags"

    id: Optional[int] = Field(default=None, primary_key=True)
    saved_question_id: int = Field(foreign_key="saved_questions.id", ondelete="CASCADE")
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SavedQuestionAnalysis(SQLModel, table=True):
    __tablename__ = "saved_question_analyses"

    id: Optional[int] = Field(default=None, primary_key=True)
    saved_question_id: int = Field(
        foreign_key="saved_questions.id", ondelete="CASCADE", unique=True
    )
    example_response: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    follow_ups: list["SavedQuestionAnalysisFollowUp"] = Relationship()
    tips: list["SavedQuestionAnalysisTip"] = Relationship()


class SavedQuestionAnalysisFollowUp(SQLModel, table=True):
    __tablename__ = "saved_question_analysis_follow_ups"

    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: int = Field(
        foreign_key="saved_question_analyses.id", ondelete="CASCADE", index=True
    )
    content: str


class SavedQuestionAnalysisTip(SQLModel, table=True):
    __tablename__ = "saved_question_analysis_tips"

    id: Optional[int] = Field(default=None, primary_key=True)
    analysis_id: int = Field(
        foreign_key="saved_question_analyses.id", ondelete="CASCADE", index=True
    )
    content: str
