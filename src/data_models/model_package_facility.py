from sqlalchemy import Column, String, ForeignKey

from data_models.model_compliance_package import CompliancePackage
from data_models.model_facilities import Facility
from data_models.models import Base, get_collation_ids


class PackageFacility(Base):
    __tablename__ = 'package_facilities'
    __table_args__ = {'extend_existing': True}

    package_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(CompliancePackage.package_id),
        primary_key=True
    )
    facility_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Facility.facility_id),
        primary_key=True
    )

    # Relationship back to CompliancePackage (already defined in CompliancePackage model)
