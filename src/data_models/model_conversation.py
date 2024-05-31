from sqlalchemy import ForeignKey, String, Column, DateTime

from data_models.model_organization import Organization
from data_models.model_user import User
from data_models.models import set_fields_from_dict, Base, get_collation_ids


class Conversation(Base):
    __tablename__ = 'conversations'
    __table_args__ = {'extend_existing': True}

    conversation_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    organization_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Organization.id)
    )
    conversation_title = Column(String(255))
    receiver_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(User.user_id)
    )
    created_at = Column(DateTime)
    updated_at = Column(DateTime)


    def __init__(self, **kwargs):
        date_fields = ['created_at', 'updated_at']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "conversation_id": self.conversation_id,
            "organization_id": self.organization_id,
            "conversation_title": self.conversation_title,
            "receiver_id": self.receiver_id,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S") if self.updated_at else None,
        }
