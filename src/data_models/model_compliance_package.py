import datetime

from sqlalchemy import Column, String, ForeignKey, DateTime

from data_models.model_organization import Organization
from data_models.models import Base, get_collation_ids


class CompliancePackage(Base):
    __tablename__ = 'compliance_packages'
    __table_args__ = {'extend_existing': True}

    package_id = Column(
        String(36, collation=get_collation_ids()),
        primary_key=True
    )
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    name = Column(String(255), nullable=False)
    creation_date = Column(DateTime, nullable=False)

    def __init__(self, **kwargs):
        date_fields = ['creation_date']
        for key, value in kwargs.items():
            if key in date_fields:
                # Parse value as datetime if the key is "created"
                value = datetime.datetime.strptime(value, "%Y-%m-%d %H:%M:%S")  # Adjust format if needed
            setattr(self, key, value)

    def to_dict(self):
        return {
            "package_id": self.package_id,
            "organization_id": self.organization_id,
            "name": self.name,
            "creation_date": self.creation_date.strftime("%Y-%m-%d %H:%M:%S")
        }
