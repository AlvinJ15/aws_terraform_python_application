import datetime

from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from data_models.model_document_type import DocumentType
from data_models.model_organization import Organization
from data_models.model_roles import Role
from data_models.models import Base, get_collation_ids, set_fields_from_dict


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

    roles = relationship(Role, secondary="package_roles", backref="compliance_package", lazy="select", viewonly=True,
                         cascade="all, delete-orphan")
    document_types = relationship(DocumentType, secondary="package_documents", backref="compliance_package",
                                  lazy="select", viewonly=True, cascade="all, delete-orphan")

    def __init__(self, **kwargs):
        date_fields = ['creation_date']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "package_id": self.package_id,
            "organization_id": self.organization_id,
            "name": self.name,
            "creation_date": self.creation_date.strftime("%Y-%m-%d %H:%M:%S"),
            "roles": [role.role_id for role in self.roles],
            "document_types": [document_type.id for document_type in self.document_types]
        }
