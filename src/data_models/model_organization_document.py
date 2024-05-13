from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.orm import relationship

from data_models.model_organization import Organization
from data_models.model_facilities import Facility
from data_models.models import Base, get_collation_ids

PURPOSE_VALUES = [
    "Signature required",
    "Download only"
]


class OrganizationDocument(Base):
    __tablename__ = "org_documents"
    __table_args__ = {'extend_existing': True}

    document_id = Column(
        String(36, collation=get_collation_ids()),
        primary_key=True
    )
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    title = Column(String(255), nullable=False)
    description = Column(String(255))
    purpose = Column(Enum(*PURPOSE_VALUES), nullable=False)
    s3_path = Column(String(255))

    facilities = relationship(Facility, secondary="org_document_facilities", backref="organization_documents", lazy="subquery",
                         viewonly=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "document_id": self.document_id,
            "organization_id": self.organization_id,
            "title": self.title,
            "description": self.description,
            "purpose": self.purpose,
            "s3_path": self.s3_path,
            "facilities": [facility.facility_id for facility in self.facilities]
        }
