from sqlalchemy import Column, String, ForeignKey

from models import Base


class PackageRole(Base):
    __tablename__ = 'package_roles'

    package_id = Column(String(36, collation='utf8mb4_unicode_ci'), ForeignKey('compliance_packages.package_id'),
                        primary_key=True)
    role_id = Column(String(36, collation='utf8mb4_unicode_ci'), ForeignKey('roles.role_id'), primary_key=True)

    # Relationship back to CompliancePackage (already defined in CompliancePackage model)
