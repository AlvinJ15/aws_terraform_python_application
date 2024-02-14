from sqlalchemy import Column, String, DateTime

from data_models.models import get_collation_ids, Base, set_fields_from_dict


class Administrator(Base):
    __tablename__ = 'administrators'
    __table_args__ = {'extend_existing': True}

    admin_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    created = Column(DateTime, nullable=False)

    def __init__(self, **kwargs):
        date_fields = ['created']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "admin_id": self.admin_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "created": self.creation_date.strftime("%Y-%m-%d %H:%M:%S")
        }
