"""remove abandoned interview status

Revision ID: 051674587ba4
Revises: be84d05bbfe2
Create Date: 2026-11-23 13:20:16.066079

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = "051674587ba4"
down_revision: Union[str, Sequence[str], None] = "be84d05bbfe2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TABLE interview_sessions ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TYPE interviewstatus RENAME TO interviewstatus_old")
    op.execute("CREATE TYPE interviewstatus AS ENUM ('IN_PROGRESS', 'COMPLETED')")
    op.execute(
        "ALTER TABLE interview_sessions ALTER COLUMN status TYPE interviewstatus "
        "USING status::text::interviewstatus"
    )
    op.execute(
        "ALTER TABLE interview_sessions ALTER COLUMN status SET DEFAULT 'IN_PROGRESS'"
    )
    op.execute("DROP TYPE interviewstatus_old")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("ALTER TYPE interviewstatus ADD VALUE 'ABANDONED'")
