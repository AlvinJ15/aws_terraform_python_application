from sqlalchemy import ForeignKey, String, Column, Enum, DateTime, Text

from data_models.model_conversation import Conversation
from data_models.model_user import User
from data_models.models import set_fields_from_dict, Base, get_collation_ids

STATUS = ['sent', 'delivered', 'un-delivered']


class Message(Base):
    __tablename__ = 'messages'
    __table_args__ = {'extend_existing': True}

    message_id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    sender_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(User.user_id)
    )
    receiver_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(User.user_id)
    )
    content = Column(Text)
    status = Column(Enum(*STATUS), nullable=False)
    conversation_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Conversation.conversation_id)
    )
    created_at = Column(DateTime)

    def __init__(self, **kwargs):
        date_fields = ['expiry_date', 'approval_date', 'upload_date']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            "message_id": self.message_id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "content": self.content,
            "status": self.status,
            "conversation_id": self.conversation_id,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
        }
