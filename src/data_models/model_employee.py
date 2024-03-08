from __future__ import annotations

from typing import TYPE_CHECKING
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from data_models.model_administrator import Administrator
from data_models.model_compliance_package import CompliancePackage

if TYPE_CHECKING:
    from data_models.model_employee_profile import EmployeeProfile
else:
    EmployeeProfile = "EmployeeProfile"
from data_models.model_organization import Organization
from data_models.models import get_collation_ids, Base, set_fields_from_dict


class Employee(Base):
    __tablename__ = 'employees'
    __table_args__ = {'extend_existing': True}

    employee_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    assignee_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Administrator.admin_id)
    )
    compliance_tags = Column(String(255))
    user_tags = Column(String(255))
    status = Column(String(255))
    created = Column(DateTime, nullable=False)

    profile = relationship(EmployeeProfile, backref="employee", uselist=False)
    compliance_packages = relationship(
        CompliancePackage, secondary="employee_compliance_packages", backref="employee_questionnaire_responses",
        lazy="select", viewonly=True, cascade="all, delete-orphan"
    )
    admin = relationship("Administrator", backref="assigned_users")
    organization = relationship("Organization", backref="organization")

    def __init__(self, **kwargs):
        date_fields = ['created']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "employee_id": self.employee_id,
            "organization_id": self.organization_id,
            "assignee_id": self.assignee_id,
            "compliance_tags": self.compliance_tags,
            "user_tags": self.user_tags,
            "status": self.status,
            "created": self.created.strftime("%Y-%m-%d %H:%M:%S"),
            "profile": self.profile.to_dict(),
            "assignee": self.admin.email if self.admin else '',
            "compliance_packages_names": [package.name for package in self.compliance_packages]
        }
