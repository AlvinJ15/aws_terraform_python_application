from sqlalchemy import Column, String, ForeignKey, JSON

from data_models.model_organization import Organization
from data_models.models import Base, get_collation_ids


class Questionnaire(Base):
    __tablename__ = "questionnaires"
    __table_args__ = {'extend_existing': True}

    questionnaire_id = Column(
        String(36, collation=get_collation_ids()),
        primary_key=True
    )
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    title = Column(String(255), nullable=False)
    definition = Column(JSON, nullable=False)

    def to_dict(self):
        return {
            "questionnaire_id": self.questionnaire_id,
            "organization_id": self.organization_id,
            "title": self.title,
            "definition": self.definition
        }
