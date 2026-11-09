"""drop unused time_limit_ms and memory_limit_kb from coding_problems

Revision ID: d9c37aa4bbdf
Revises: 66803152ecf4
Create Date: 2026-11-07 20:55:48.814095

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = "d9c37aa4bbdf"
down_revision: Union[str, Sequence[str], None] = "66803152ecf4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column("coding_problems", "time_limit_ms")
    op.drop_column("coding_problems", "memory_limit_kb")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column(
        "coding_problems",
        sa.Column("time_limit_ms", sa.Integer(), nullable=False, server_default="2000"),
    )
    op.add_column(
        "coding_problems",
        sa.Column(
            "memory_limit_kb", sa.Integer(), nullable=False, server_default="65536"
        ),
    )
