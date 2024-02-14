from sqlalchemy import ForeignKey, String, Column, Enum, DateTime

from data_models.model_employee import Employee
from data_models.models import Base, get_collation_ids, set_fields_from_dict

STATUS = ['Awaiting Approval', 'Approved', 'Sent', 'Rejected']


class EmployeeReference(Base):
    __tablename__ = 'employee_references'
    __table_args__ = {'extend_existing': True}

    reference_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    employee_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Employee.employee_id)
    )
    referee_name = Column(String(255))
    referee_email = Column(String(255))
    referee_phone = Column(String(255))
    status = Column(Enum(*STATUS), nullable=False)
    s3_path = Column(String(255))
    created_date = Column(DateTime)
    completion_date = Column(DateTime)

    def __init__(self, **kwargs):
        date_fields = ['created_date', 'completion_date']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "reference_id": self.reference_id,
            "employee_id": self.employee_id,
            "referee_name": self.referee_name,
            "referee_email": self.referee_email,
            "referee_phone": self.referee_phone,
            "status": self.status,
            "s3_path": self.s3_path,
            "created_date": self.created_date.strftime("%Y-%m-%d %H:%M:%S") if self.created_date else None,
            "completion_date": self.completion_date.strftime("%Y-%m-%d %H:%M:%S") if self.completion_date else None,
        }
