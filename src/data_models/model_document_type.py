from sqlalchemy import Column, Integer, String, ForeignKey, Enum, CheckConstraint

from models import Base


class DocumentType(Base):
    __tablename__ = 'document_types'

    id = Column(String(36, collation='utf8mb4_unicode_ci'), primary_key=True)
    organization_id = Column(String(36, collation='utf8mb4_unicode_ci'), ForeignKey('organizations.id'))
    name = Column(String(255), nullable=False)
    description = Column(String(255))
    category = Column(Enum('Personal', 'Certificates', name='document_category'), nullable=False)
    expiration = Column(Integer, nullable=True, default=None)  # Null by default

    # Check constraint for expiration (max 120 months)
    __table_args__ = (
        CheckConstraint('expiration >= 0 AND expiration <= 120', name='expiration_range'),
    )
