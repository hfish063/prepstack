"""Add kind column to messages

Revision ID: 2a026fc8ca84
Revises: 9b69e839654f
Create Date: 2026-11-16 19:45:23.541292

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "2a026fc8ca84"
down_revision: Union[str, Sequence[str], None] = "9b69e839654f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

message_kind = sa.Enum("MESSAGE", "HINT", name="messagekind")


def upgrade() -> None:
    """Upgrade schema."""
    # Postgres enum types must exist before a column can reference them
    message_kind.create(op.get_bind(), checkfirst=True)

    # Existing rows are backfilled as regular messages via the server default
    op.add_column(
        "messages",
        sa.Column("kind", message_kind, nullable=False, server_default="MESSAGE"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("messages", "kind")
    message_kind.drop(op.get_bind(), checkfirst=True)
