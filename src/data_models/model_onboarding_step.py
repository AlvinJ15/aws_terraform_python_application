from enum import Enum as EnumType

from sqlalchemy import Column, String, ForeignKey, Enum, Boolean, JSON
from sqlalchemy.dialects.mysql import TINYINT

from data_models.model_onboarding import Onboarding
from data_models.model_organization import Organization
from data_models.models import Base


class TypeEnum(EnumType):
    UPLOAD_MANDATORY_DOCUMENTS = "Upload mandatory documents"
    READ_AND_DOWNLOAD_DOCUMENTS = "Read and download documents"
    WELCOME = "Welcome"
    VIDEO_TRAINING = "Video training"
    QUESTIONNAIRE = "Questionnaire"
    INFORMATION = "Information"
    EMPLOYEE_APPROVAL = "Employee Approval"
    LAUNCH_WEBPAGE = "Launch webpage"
    REFERENCE_CHECK = "Reference check"
    UPLOAD_SPECIFIC_DOCUMENTS = "Upload specific documents"


class OnboardingStep(Base):
    __tablename__ = "onboarding_steps"
    __table_args__ = {'extend_existing': True}

    step_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        primary_key=True
    )
    organization_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        ForeignKey(Organization.id)
    )
    onboarding_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        ForeignKey(Onboarding.onboarding_id)
    )
    type = Column(Enum(TypeEnum), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(255))
    order = Column(TINYINT, nullable=False)
    mandatory = Column(Boolean, nullable=False)
    additional_properties = Column(JSON)
