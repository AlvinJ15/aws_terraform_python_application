from sqlalchemy import Column, String, ForeignKey

from data_models.model_organization_document import OrganizationDocument
from data_models.model_roles import Role
from data_models.models import Base


class OrganizationDocumentRole(Base):
    __tablename__ = "org_document_roles"
    __table_args__ = {'extend_existing': True}

    document_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        ForeignKey(OrganizationDocument.document_id),
        primary_key=True
    )
    role_id = Column(
        String(36, collation="utf8mb4_unicode_ci"),
        ForeignKey(Role.role_id),
        primary_key=True
    )
