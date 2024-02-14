from sqlalchemy import ForeignKey, String, Column, Enum, DateTime, Integer

from data_models.model_administrator import Administrator
from data_models.model_document_type import DocumentType
from data_models.model_employee import Employee
from data_models.models import set_fields_from_dict, Base, get_collation_ids

STATUS = ['Awaiting Approval', 'Approved', 'Rejected', 'Expired', 'Expires soon']


class EmployeeDocument(Base):
    __tablename__ = 'employee_documents'
    __table_args__ = {'extend_existing': True}

    document_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    employee_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Employee.employee_id)
    )
    document_type_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(DocumentType.id)
    )
    expiry_date = Column(DateTime)
    document_number = Column(String(255))
    status = Column(Enum(*STATUS), nullable=False)
    approval_date = Column(DateTime)
    approver_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Administrator.admin_id)
    )
    s3_path = Column(String(255))
    upload_date = Column(DateTime)

    def __init__(self, **kwargs):
        date_fields = ['expiry_date', 'approval_date', 'upload_date']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "document_id": self.document_id,
            "employee_id": self.employee_id,
            "document_type_id": self.document_type_id,
            "expiry_date": self.expiry_date.strftime("%Y-%m-%d %H:%M:%S") if self.expiry_date else None,
            "document_number": self.document_number,
            "status": self.status,
            "approval_date": self.approval_date.strftime("%Y-%m-%d %H:%M:%S") if self.approval_date else None,
            "approver_id": self.approver_id,
            "s3_path": self.s3_path,
            "upload_date": self.upload_date.strftime("%Y-%m-%d %H:%M:%S") if self.upload_date else None,
        }
