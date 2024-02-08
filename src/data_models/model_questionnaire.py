from sqlalchemy import Column, String, ForeignKey, JSON

from data_models.model_organization import Organization
from data_models.models import Base


class Questionnaire(Base):
    __tablename__ = "questionnaires"
    __table_args__ = {'extend_existing': True}

    questionnaire_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        primary_key=True
    )
    organization_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        ForeignKey(Organization.id)
    )
    title = Column(String(255), nullable=False)
    definition = Column(JSON, nullable=False)
