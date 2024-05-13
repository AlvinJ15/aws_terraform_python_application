from sqlalchemy import Column, String, ForeignKey

from data_models.model_organization_document import OrganizationDocument
from data_models.model_facilities import Facility
from data_models.models import Base, get_collation_ids


class OrganizationDocumentFacility(Base):
    __tablename__ = "org_document_facilities"
    __table_args__ = {'extend_existing': True}

    document_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(OrganizationDocument.document_id),
        primary_key=True
    )
    facility_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Facility.facility_id),
        primary_key=True
    )
