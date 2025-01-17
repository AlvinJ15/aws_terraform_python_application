from __future__ import annotations

from typing import TYPE_CHECKING
from sqlalchemy import Column, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship

from data_models.model_administrator import Administrator
from data_models.model_compliance_package import CompliancePackage
from data_models.model_facilities import Facility

if TYPE_CHECKING:
    from data_models.model_employee_profile import EmployeeProfile
else:
    EmployeeProfile = "EmployeeProfile"
from data_models.model_organization import Organization
from data_models.models import get_collation_ids, Base, set_fields_from_dict

ROLE_TYPE_VALUES = ['Travel', 'Per Diem']


class Employee(Base):
    __tablename__ = 'employees'
    __table_args__ = {'extend_existing': True}

    employee_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    facility_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Facility.facility_id)
    )
    assignee_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Administrator.admin_id)
    )
    compliance_tags = Column(String(255))
    user_tags = Column(String(255))
    notes = Column(String(255))
    role_type = Column(Enum(*ROLE_TYPE_VALUES), nullable=False)
    start_date = Column(DateTime)
    status = Column(String(255))
    created = Column(DateTime, nullable=False)

    profile = relationship(EmployeeProfile, backref="employee", uselist=False)
    documents = relationship("EmployeeDocument", backref="employee")
    compliance_packages = relationship(
        CompliancePackage, secondary="employee_compliance_packages", backref="employee_questionnaire_responses",
        lazy="select", viewonly=True, cascade="all, delete-orphan"
    )
    admin = relationship("Administrator", backref="assigned_users")
    organization = relationship("Organization", backref="organization")
    facility = relationship("Facility", backref="facility")

    def __init__(self, **kwargs):
        date_fields = ['created']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "employee_id": self.employee_id,
            "organization_id": self.organization_id,
            "facility_id": self.facility_id,
            "facility": self.facility.to_dict() if self.facility else None,
            "assignee_id": self.assignee_id,
            "compliance_tags": self.compliance_tags,
            "user_tags": self.user_tags,
            "notes": self.notes,
            "role_type": self.role_type,
            "start_date": self.start_date.strftime("%Y-%m-%d") if self.start_date else None,
            "status": self.status,
            "created": self.created.strftime("%Y-%m-%d"),
            "profile": self.profile.to_dict(),
            "assignee": self.admin.email if self.admin else '',
            "compliance_packages_names": [package.name for package in self.compliance_packages]
        }
