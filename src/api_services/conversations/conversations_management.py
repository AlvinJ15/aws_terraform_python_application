import json

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_conversation import Conversation
from data_models.model_employee import Employee
from data_models.model_message import Message


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    page_number = 1
    number_per_page = 10
    if 'queryStringParameters' in event and event['queryStringParameters'] is not None:
        page_number = int(event.get('queryStringParameters', {}).get('page', 1))
    offset = (page_number - 1) * number_per_page

    with DataBase.get_session(stage) as db:
        conversations = (
            db.query(Conversation).filter_by(organization_id=organization_id)
            .order_by(Conversation.updated_at.desc()).limit(number_per_page).offset(offset).all()
        )
        return {
            "statusCode": 200,
            "body": json.dumps([config_receiver(db, conversation) for conversation in conversations])
        }


def config_receiver(db, conversation):
    json_object = conversation.to_dict()
    employee_receiver = db.query(Employee).filter_by(employee_id=conversation.receiver_id).first()
    if employee_receiver:
        json_object['receiver'] = {
            'user_id': employee_receiver.employee_id,
            'name': employee_receiver.profile.get_name(),
            'phone_number': employee_receiver.profile.phone_number
        }
    return json_object


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    conversation_id = event["pathParameters"]["conversation_id"]

    with DataBase.get_session(stage) as db:
        conversation = db.query(Conversation).filter_by(conversation_id=conversation_id).first()
        if conversation:
            return {
                "statusCode": 200,
                "body": json.dumps(conversation.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "Conversation not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    conversation_id = event["pathParameters"]["conversation_id"]

    with DataBase.get_session(stage) as db:
        conversation = db.query(Conversation).filter_by(conversation_id=conversation_id).first()
        if conversation:
            db.query(Message).filter_by(conversation_id=conversation_id).delete()
            db.delete(conversation)
            db.commit()  # Commit the deletion to the database
            return {
                "statusCode": 200,
                "body": json.dumps({"deleted_id": conversation.conversation_id})
            }
        else:
            return {"statusCode": 404, "body": "Conversation not found"}
