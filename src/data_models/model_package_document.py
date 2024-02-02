from sqlalchemy import Column, String, ForeignKey

from models import Base


class PackageDocument(Base):
    __tablename__ = 'package_documents'

    package_id = Column(String(36, collation='utf8mb4_unicode_ci'), ForeignKey('compliance_packages.package_id'),
                        primary_key=True)
    document_type_id = Column(String(36, collation='utf8mb4_unicode_ci'), ForeignKey('document_types.id'),
                              primary_key=True)

    # Relationship back to CompliancePackage (already defined in CompliancePackage model)
