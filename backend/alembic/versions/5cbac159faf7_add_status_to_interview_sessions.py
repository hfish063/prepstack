"""add status to interview_sessions

Revision ID: 5cbac159faf7
Revises: 81a42bd6275f
Create Date: 2026-11-02 12:07:38.612111

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = "5cbac159faf7"
down_revision: Union[str, Sequence[str], None] = "81a42bd6275f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

interview_status_enum = postgresql.ENUM(
    "IN_PROGRESS", "COMPLETED", "ABANDONED", name="interviewstatus"
)


def upgrade() -> None:
    """Upgrade schema."""
    interview_status_enum.create(op.get_bind(), checkfirst=True)
    op.add_column(
        "interview_sessions",
        sa.Column(
            "status",
            interview_status_enum,
            nullable=False,
            server_default="IN_PROGRESS",
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("interview_sessions", "status")
    interview_status_enum.drop(op.get_bind(), checkfirst=True)
