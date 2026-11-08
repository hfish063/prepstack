"""unify problem examples into test cases

Revision ID: 66803152ecf4
Revises: 0638244cfdd1
Create Date: 2026-11-07 20:51:02.525110

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '66803152ecf4'
down_revision: Union[str, Sequence[str], None] = '0638244cfdd1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "problem_test_cases",
        sa.Column(
            "hidden",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )
    op.add_column(
        "problem_test_cases",
        sa.Column("explanation", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    )

    # Move existing problem_examples rows into problem_test_cases as visible
    # (hidden=false) rows, preserving their data. Ids are not carried over;
    # problem_test_cases assigns its own via its own identity sequence.
    op.execute(
        """
        INSERT INTO problem_test_cases
            (problem_id, input, expected_output, ordinal, hidden, explanation)
        SELECT
            problem_id, input, expected_output, ordinal, false, explanation
        FROM problem_examples
        """
    )

    op.drop_table("problem_examples")


def downgrade() -> None:
    """Downgrade schema."""
    op.create_table(
        "problem_examples",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("problem_id", sa.Integer(), nullable=False),
        sa.Column("input", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column(
            "expected_output", postgresql.JSONB(astext_type=sa.Text()), nullable=False
        ),
        sa.Column("explanation", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("ordinal", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["problem_id"],
            ["coding_problems.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Move visible rows back into problem_examples, then remove them from
    # problem_test_cases along with the columns that no longer apply there.
    op.execute(
        """
        INSERT INTO problem_examples
            (problem_id, input, expected_output, ordinal, explanation)
        SELECT
            problem_id, input, expected_output, ordinal, explanation
        FROM problem_test_cases
        WHERE hidden = false
        """
    )
    op.execute("DELETE FROM problem_test_cases WHERE hidden = false")

    op.drop_column("problem_test_cases", "explanation")
    op.drop_column("problem_test_cases", "hidden")
