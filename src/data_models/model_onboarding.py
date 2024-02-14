from __future__ import annotations

import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from data_models.model_onboarding_step import OnboardingStep
else:
    OnboardingStep = "OnboardingStep"


from sqlalchemy import Column, String, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship


from data_models.model_organization import Organization
from data_models.models import Base, get_collation_ids


class Onboarding(Base):
    __tablename__ = "onboardings"
    __table_args__ = {'extend_existing': True}

    onboarding_id = Column(
        String(36, collation=get_collation_ids()),
        primary_key=True
    )
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    created = Column(DateTime, nullable=False)
    last_modified = Column(DateTime)

    steps = relationship(OnboardingStep, backref="onboarding")

    def __init__(self, **kwargs):
        date_fields = ['created', 'last_modified']
        for key, value in kwargs.items():
            if key in date_fields and value is not None:
                # Parse value as datetime if the key is "created"
                value = datetime.datetime.strptime(value, "%Y-%m-%d %H:%M:%S")  # Adjust format if needed
            setattr(self, key, value)

    def to_dict(self):
        return {
            "onboarding_id": self.onboarding_id,
            "organization_id": self.organization_id,
            "created": self.created.strftime("%Y-%m-%d %H:%M:%S"),
            "last_modified": self.last_modified.strftime("%Y-%m-%d %H:%M:%S") if self.last_modified else None,
            "steps": [step.to_dict() for step in self.steps]
        }
