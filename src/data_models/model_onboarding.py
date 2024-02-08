from enum import Enum as EnumType

from sqlalchemy import Column, String, ForeignKey, Enum, DateTime

from data_models.model_organization import Organization
from data_models.models import Base


class PurposeEnum(EnumType):
    SIGNATURE_REQUIRED = "Signature required"
    DOWNLOAD_ONLY = "Download only"


class Onboarding(Base):
    __tablename__ = "onboardings"
    __table_args__ = {'extend_existing': True}

    onboarding_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        primary_key=True
    )
    organization_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        ForeignKey(Organization.id)
    )
    created = Column(DateTime, nullable=False)
    last_modified = Column(DateTime)
