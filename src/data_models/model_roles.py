from sqlalchemy import Column, String, ForeignKey, Enum

from data_models.model_organization import Organization
from data_models.models import Base


class Role(Base):
    __tablename__ = 'roles'
    __table_args__ = {'extend_existing': True}

    role_id = Column(String(36, collation='utf8mb4_unicode_ci'), primary_key=True)
    organization_id = Column(
        String(36, collation='utf8mb4_unicode_ci'),
        ForeignKey(Organization.id)
    )
    name = Column(String(255), nullable=False)
    description = Column(String(255))
    type = Column(Enum('Clinical', 'Non-Clinical', name='role_type'), nullable=False)

    def to_dict(self):
        return {
            "role_id": self.role_id,
            "organization_id": self.organization_id,
            "name": self.name,
            "description": self.description,
            "type": self.type
        }
