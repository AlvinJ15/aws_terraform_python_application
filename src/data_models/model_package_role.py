from sqlalchemy import Column, String, ForeignKey

from data_models.model_compliance_package import CompliancePackage
from data_models.model_roles import Role
from data_models.models import Base


class PackageRole(Base):
    __tablename__ = 'package_roles'
    __table_args__ = {'extend_existing': True}

    package_id = Column(
        String(36, collation='utf8mb4_unicode_ci'),
        ForeignKey(CompliancePackage.package_id),
        primary_key=True
    )
    role_id = Column(
        String(36, collation='utf8mb4_unicode_ci'),
        ForeignKey(Role.role_id),
        primary_key=True
    )

    # Relationship back to CompliancePackage (already defined in CompliancePackage model)
