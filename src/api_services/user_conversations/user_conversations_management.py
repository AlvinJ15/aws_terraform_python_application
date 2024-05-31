import json

from api_services.conversations.conversations_management import config_receiver
from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_conversation import Conversation
from data_models.model_employee import Employee
from data_models.models import update_object_from_dict


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    user_id = event["pathParameters"]["employee_id"]

    with DataBase.get_session(stage) as db:
        conversation = db.query(Conversation).filter_by(receiver_id=user_id).first()
        if conversation:
            json_object = config_receiver(db, conversation)
            return {
                "statusCode": 200,
                "body": json.dumps(json_object)
            }
        else:
            return {"statusCode": 404, "body": "{}"}


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    user_id = event["pathParameters"]["employee_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        employee = db.query(Employee).filter_by(employee_id=user_id).first()
        new_conversation = Conversation(**data)
        new_conversation.conversation_id = DataBase.generate_uuid()
        new_conversation.organization_id = organization_id
        new_conversation.receiver_id = user_id
        new_conversation.conversation_title = employee.profile.get_name()
        new_conversation.created_at = DataBase.get_now()
        new_conversation.updated_at = DataBase.get_now()
        db.add(new_conversation)
        db.flush()
        db.commit()
        return {
            "statusCode": 201,
            "body": json.dumps(config_receiver(db, new_conversation))
        }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    user_id = event["pathParameters"]["employee_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        conversation = db.query(Conversation).filter_by(
            receiver_id=user_id
        ).first()
        if conversation:
            DataBase.pop_non_updatable_fields([
                "created_at", "conversation_id", "organization_id", "receiver_id", "updated_at"
            ], data)
            conversation = update_object_from_dict(conversation, data)
            conversation.updated_at = DataBase.get_now()
            db.commit()
            return {
                "statusCode": 200,
                "body": json.dumps(config_receiver(db, conversation))
            }
        else:
            return {"statusCode": 404, "body": "Conversation not found"}
