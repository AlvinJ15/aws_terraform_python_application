from sqlalchemy import Column, Integer, String, ForeignKey, Enum, CheckConstraint

from data_models.model_organization import Organization
from data_models.models import Base, get_collation_ids


class DocumentType(Base):
    __tablename__ = 'document_types'

    id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    name = Column(String(255), nullable=False)
    description = Column(String(255))
    category = Column(Enum('Personal', 'Certificates', name='document_category'), nullable=False)
    expiration = Column(Integer, nullable=True, default=None)  # Null by default

    # Check constraint for expiration (max 120 months)
    __table_args__ = (
        CheckConstraint('expiration >= 0 AND expiration <= 120', name='expiration_range'),
        {'extend_existing': True}
    )

    def to_dict(self):
        return {
            "id": self.id,
            "organization_id": self.organization_id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "expiration": self.expiration
        }
