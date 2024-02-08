from enum import Enum as EnumType

from sqlalchemy import Column, String, ForeignKey, Enum

from data_models.model_organization import Organization
from data_models.models import Base


class PurposeEnum(EnumType):
    SIGNATURE_REQUIRED = "Signature required"
    DOWNLOAD_ONLY = "Download only"


class OrganizationDocument(Base):
    __tablename__ = "org_documents"
    __table_args__ = {'extend_existing': True}

    document_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        primary_key=True
    )
    organization_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        ForeignKey(Organization.id)
    )
    title = Column(String(255), nullable=False)
    description = Column(String(255))
    purpose = Column(Enum(PurposeEnum), nullable=False)
    s3_path = Column(String(255))
