"""update problem_submissions table

Revision ID: b6d67c507f40
Revises: d9c37aa4bbdf
Create Date: 2026-11-09 13:57:06.744732

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'b6d67c507f40'
down_revision: Union[str, Sequence[str], None] = 'd9c37aa4bbdf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "problem_submissions",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
    )
    op.alter_column(
        "problem_submissions", "passed_test_cases", existing_type=sa.Integer(), nullable=True
    )
    op.drop_column("problem_submissions", "execution_time_ms")
    op.drop_column("problem_submissions", "memory_used_kb")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column(
        "problem_submissions",
        sa.Column(
            "memory_used_kb", sa.Float(), nullable=False, server_default="0"
        ),
    )
    op.add_column(
        "problem_submissions",
        sa.Column(
            "execution_time_ms", sa.Float(), nullable=False, server_default="0"
        ),
    )
    op.alter_column(
        "problem_submissions", "passed_test_cases", existing_type=sa.Integer(), nullable=False
    )
    op.drop_column("problem_submissions", "updated_at")
