from sqlalchemy import Column, String

from data_models.models import Base


class Organization(Base):
    __tablename__ = 'organizations'
    __table_args__ = {'extend_existing': True}

    id = Column(String(36, collation='utf8mb4_unicode_ci'), primary_key=True)
    # ... other organization fields
