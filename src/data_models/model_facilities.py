from sqlalchemy import Column, String, ForeignKey, Enum

from data_models.model_organization import Organization
from data_models.models import Base, get_collation_ids


class Facility(Base):
    __tablename__ = 'facilities'
    __table_args__ = {'extend_existing': True}

    facility_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    name = Column(String(255), nullable=False)
    description = Column(String(255))
    type = Column(Enum('Clinical', 'Non-Clinical', name='facility_type'), nullable=False)

    def to_dict(self):
        return {
            "facility_id": self.facility_id,
            "organization_id": self.organization_id,
            "name": self.name,
            "description": self.description,
            "type": self.type
        }
