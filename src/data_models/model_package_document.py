from sqlalchemy import Column, String, ForeignKey

from data_models.model_compliance_package import CompliancePackage
from data_models.model_document_type import DocumentType
from data_models.models import Base, get_collation_ids


class PackageDocument(Base):
    __tablename__ = 'package_documents'
    __table_args__ = {'extend_existing': True}

    package_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(CompliancePackage.package_id),
        primary_key=True
    )
    document_type_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(DocumentType.id),
        primary_key=True
    )

    # Relationship back to CompliancePackage (already defined in CompliancePackage model)
