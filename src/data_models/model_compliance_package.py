from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from data_models.model_organization import Organization
from data_models.models import Base


class CompliancePackage(Base):
    __tablename__ = 'compliance_packages'
    __table_args__ = {'extend_existing': True}

    package_id = Column(String(36, collation='utf8mb4_unicode_ci'), primary_key=True)
    organization_id = Column(String(36, collation='utf8mb4_unicode_ci'), ForeignKey(Organization.id))
    name = Column(String(255), nullable=False)
    creation_date = Column(DateTime, nullable=False)

    # Relationships (one-to-many)
    roles = relationship('PackageRole', backref='compliance_package')
    documents = relationship('PackageDocument', backref='compliance_package')
