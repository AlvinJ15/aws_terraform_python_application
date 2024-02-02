from sqlalchemy import Column, String

from models import Base


class Organization(Base):
    __tablename__ = 'organizations'

    id = Column(String(36, collation='utf8mb4_unicode_ci'), primary_key=True)
    # ... other organization fields
