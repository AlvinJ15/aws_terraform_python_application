import json
import os

from api_services.employees.employees_utils import get_employees_with_filter
from api_services.utils.clicksend_utils import ClickSend
from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_conversation import Conversation
from data_models.model_employee import Employee
from data_models.model_message import Message


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    conversation_id = event["pathParameters"]["conversation_id"]
    page_number = 1
    number_per_page = 10

    if 'queryStringParameters' in event and event['queryStringParameters'] is not None:
        page_number = int(event.get('queryStringParameters', {}).get('page', 1))
    offset = (page_number - 1) * number_per_page

    with DataBase.get_session(stage) as db:
        messages = (
            db.query(Message).filter_by(conversation_id=conversation_id)
            .order_by(Message.created_at.desc()).limit(number_per_page).offset(offset).all()
        )
        return {
            "statusCode": 200,
            "body": json.dumps([config_receiver_sender(db, message) for message in messages])
        }


def config_receiver_sender(db, message):
    json_object = message.to_dict()
    employee_sender = db.query(Employee).filter_by(employee_id=message.sender_id).first()
    if employee_sender:
        json_object['sender'] = {
            'user_id': employee_sender.employee_id,
            'name': employee_sender.profile.get_name(),
        }

    employee_receiver = db.query(Employee).filter_by(employee_id=message.receiver_id).first()
    if employee_receiver:
        json_object['receiver'] = {
            'user_id': employee_receiver.employee_id,
            'name': employee_receiver.profile.get_name(),
        }
    return json_object


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    conversation_id = event["pathParameters"]["conversation_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        new_message = Message(**data)
        if new_message.sender_id is None:
            new_message = configure_sender_with_session(db, new_message, organization_id, event)
        new_message.message_id = DataBase.generate_uuid()
        new_message.conversation_id = conversation_id
        new_message.created_at = DataBase.get_now()
        new_message.status = 'sent'
        # sender = db.query(Employee).filter_by(employee_id=new_message.sender_id).first()
        # administrator = db.query(Administrator).filter_by(email=sender.profile.email).first()
        # custom_string = {
        #     'conversation_id': conversation_id,
        #     'receiver_id': new_message.receiver_id,
        #     'sender_id': new_message.sender_id,
        #     'stage': stage
        # }
        # if administrator:
        receiver = db.query(Employee).filter_by(employee_id=new_message.receiver_id).first()
        ClickSend.send_sms(
            sms_content=new_message.content,
            from_number=os.getenv('CLICK_SEND_FROM_NUMBER'),
            to_number=format_phone_number(receiver.profile.phone_number),
            custom_string=create_custom_string(new_message.message_id, stage)
        )
        db.add(new_message)
        conversation = db.query(Conversation).filter_by(conversation_id=conversation_id).first()
        conversation.updated_at = DataBase.get_now()
        db.commit()

        return {
            "statusCode": 201,
            "body": json.dumps(config_receiver_sender(db, new_message))
        }


def create_custom_string(message_id, stage):
    return f'{message_id}#{stage}'


def format_phone_number(phone_number):
    """
    This function cleans and formats a phone number to the format '+[country_code]##########'

    Args:
        phone_number: The phone number to format (str)

    Returns:
        The formatted phone number (str) or None if the number is invalid.
    """
    # Keep only digits and '+' sign
    digits_and_plus = ''.join(char for char in phone_number if char.isdigit() or char == '+')

    # Check if number has exactly 10 digits
    if len(digits_and_plus) == 10:
        digits_and_plus = '+1' + digits_and_plus  # Invalid number

    # Ensure the number starts with '+'
    formatted_number = '+' + digits_and_plus.lstrip('+')

    return formatted_number


def compact_json_dumps(data):
    return json.dumps(data, separators=(',', ':'))  # Custom separators


def configure_sender_with_session(db, message, organization_id, event):
    email = event['requestContext']['authorizer']['claims']['email']
    event['queryStringParameters'] = {'email': email}
    query = get_employees_with_filter(db, organization_id, event['queryStringParameters'])
    employee = query.first()
    message.sender_id = employee.employee_id
    return message
