from sqlalchemy import String, Column, DateTime

from data_models.models import set_fields_from_dict, Base, get_collation_ids


class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    user_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    phone_number = Column(String(255))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)


    def __init__(self, **kwargs):
        date_fields = ['created_at', 'updated_at']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "phone_number": self.phone_number,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S") if self.updated_at else None,
        }
