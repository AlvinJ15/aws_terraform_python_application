from sqlalchemy import Column, String, ForeignKey

from data_models.model_onboarding_step import OnboardingStep
from data_models.model_facilities import Facility
from data_models.models import Base, get_collation_ids


class StepFacility(Base):
    __tablename__ = 'step_facilities'
    __table_args__ = {'extend_existing': True}

    step_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(OnboardingStep.step_id),
        primary_key=True
    )
    facility_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Facility.facility_id),
        primary_key=True
    )
