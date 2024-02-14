from sqlalchemy import Column, String, ForeignKey, Enum, Boolean, JSON
from sqlalchemy.orm import relationship, query

from data_models.model_onboarding import Onboarding
from data_models.model_organization import Organization
from data_models.model_roles import Role
from data_models.models import Base, get_collation_ids, get_tinyint_class

TYPE_VALUES = [
    'Upload mandatory documents',
    "Read and download documents",
    "Welcome",
    "Video training",
    "Questionnaire",
    "Information",
    "Employee Approval",
    "Launch webpage",
    "Reference check",
    "Upload specific documents"
]


class OnboardingStep(Base):
    __tablename__ = "onboarding_steps"
    __table_args__ = {'extend_existing': True}

    step_id = Column(
        String(36, collation=get_collation_ids()),
        primary_key=True
    )
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    onboarding_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Onboarding.onboarding_id)
    )
    type = Column(Enum(*TYPE_VALUES), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(255))
    order = Column(get_tinyint_class(), nullable=False)
    mandatory = Column(Boolean, nullable=False)
    additional_properties = Column(JSON)

    roles = relationship(Role, secondary="step_roles", backref="steps", lazy="select", viewonly=True,
                         cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "step_id": self.step_id,
            "organization_id": self.organization_id,
            "onboarding_id": self.onboarding_id,
            "type": self.type,
            "name": self.name,
            "description": self.description,
            "order": self.order,
            "mandatory": self.mandatory,
            "additional_properties": self.additional_properties,
            "roles": [role.role_id for role in self.roles]
        }
