from sqlalchemy import Column, String, ForeignKey

from data_models.model_compliance_package import CompliancePackage
from data_models.model_employee import Employee
from data_models.models import Base, get_collation_ids


class EmployeeCompliancePackage(Base):
    __tablename__ = 'employee_compliance_packages'
    __table_args__ = {'extend_existing': True}

    employee_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Employee.employee_id),
        primary_key=True
    )
    package_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(CompliancePackage.package_id),
        primary_key=True
    )
