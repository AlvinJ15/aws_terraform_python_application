from sqlalchemy import Column, String, ForeignKey

from data_models.model_onboarding_step import OnboardingStep
from data_models.model_roles import Role
from data_models.models import Base


class StepRole(Base):
    __tablename__ = 'step_roles'
    __table_args__ = {'extend_existing': True}

    step_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        ForeignKey(OnboardingStep.step_id),
        primary_key=True
    )
    role_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        ForeignKey(Role.role_id),
        primary_key=True
    )
