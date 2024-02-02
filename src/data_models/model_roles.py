from sqlalchemy import Column, String, ForeignKey, Enum

from models import Base


class Role(Base):
    __tablename__ = 'roles'

    role_id = Column(String(36, collation='utf8mb4_unicode_ci'), primary_key=True)
    organization_id = Column(
        String(36, collation='utf8mb4_unicode_ci'),
        ForeignKey('organizations.id')
    )
    name = Column(String(255), nullable=False)
    description = Column(String(255))
    type = Column(Enum('Clinical', 'Non-Clinical', name='role_type'), nullable=False)
