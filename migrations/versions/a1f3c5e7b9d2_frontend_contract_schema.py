"""frontend contract schema

Revision ID: a1f3c5e7b9d2
Revises: 827812d57ce3
Create Date: 2026-06-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'a1f3c5e7b9d2'
down_revision = '827812d57ce3'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_table('urls')
    op.create_table(
        'urls',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('original_url', sa.String(512), nullable=False),
        sa.Column('alias', sa.String(10), nullable=False),
        sa.Column('transformation_type', sa.String(20), nullable=False, server_default='Shorten'),
        sa.Column('clicks', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('status', sa.String(20), nullable=False, server_default='Active'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('alias'),
    )


def downgrade():
    op.drop_table('urls')
    op.create_table(
        'urls',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('original_url', sa.String(512), nullable=False),
        sa.Column('short_code', sa.String(10), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('click_count', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('short_code'),
    )
