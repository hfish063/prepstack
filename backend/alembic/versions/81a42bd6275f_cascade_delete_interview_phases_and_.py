"""cascade delete interview_phases and messages

Revision ID: 81a42bd6275f
Revises: 29a10579963f
Create Date: 2026-10-16 14:49:00.357127

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = "81a42bd6275f"
down_revision: Union[str, Sequence[str], None] = "29a10579963f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint(
        op.f("interview_phases_interview_id_fkey"),
        "interview_phases",
        type_="foreignkey",
    )
    op.create_foreign_key(
        "interview_phases_interview_id_fkey",
        "interview_phases",
        "interview_sessions",
        ["interview_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.drop_constraint(op.f("messages_phase_id_fkey"), "messages", type_="foreignkey")
    op.create_foreign_key(
        "messages_phase_id_fkey",
        "messages",
        "interview_phases",
        ["phase_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("messages_phase_id_fkey", "messages", type_="foreignkey")
    op.create_foreign_key(
        "messages_phase_id_fkey", "messages", "interview_phases", ["phase_id"], ["id"]
    )
    op.drop_constraint(
        "interview_phases_interview_id_fkey", "interview_phases", type_="foreignkey"
    )
    op.create_foreign_key(
        "interview_phases_interview_id_fkey",
        "interview_phases",
        "interview_sessions",
        ["interview_id"],
        ["id"],
    )
