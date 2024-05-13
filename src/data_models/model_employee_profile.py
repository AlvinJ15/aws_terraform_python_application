from sqlalchemy import ForeignKey, String, Column, Enum, DateTime

from data_models.model_employee import Employee
from data_models.models import get_collation_ids, Base, set_fields_from_dict

COUNTRY_VALUES = ['Australia', 'Belgium', 'Canada', 'Mexico', 'United Kingdom', 'United States']


class EmployeeProfile(Base):
    __tablename__ = 'employee_profiles'
    __table_args__ = {'extend_existing': True}

    profile_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    employee_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Employee.employee_id)
    )
    title = Column(String(255))
    first_name = Column(String(255))
    last_name = Column(String(255))
    gender = Column(String(255))
    email = Column(String(255), nullable=False)
    facility = Column(String(255))
    grade = Column(String(255))
    medical_category = Column(String(255))
    specialty = Column(String(255))
    date_of_birth = Column(DateTime)
    address = Column(String(255))
    country = Column(Enum(*COUNTRY_VALUES), nullable=False)
    city = Column(String(255))
    state = Column(String(255))
    zip = Column(String(12))
    phone_number = Column(String(30), nullable=False)

    def __init__(self, **kwargs):
        date_fields = ['date_of_birth']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "profile_id": self.profile_id,
            "employee_id": self.employee_id,
            "title": self.title,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "gender": self.gender,
            "email": self.email,
            "phone_number": self.phone_number,
            "facility": self.facility,
            "grade": self.grade,
            "medical_category": self.medical_category,
            "specialty": self.specialty,
            "date_of_birth": self.date_of_birth.strftime("%Y-%m-%d %H:%M:%S") if self.date_of_birth else None,
            "address": self.address,
            "country": self.country,
            "city": self.city,
            "state": self.state,
            "zip": self.zip,
        }

    def get_name(self):
        return f"{self.first_name} {self.last_name}"
