import json
import base64
import os
import urllib.parse

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import handle_exceptions
from api_services.utils.ses_utils import SES
from data_models.model_conversation import Conversation
from data_models.model_employee import Employee

from data_models.model_message import Message


@handle_exceptions
def inbound_sms_handler(event, context):
    print('EVENT', event)
    # Get the Base64 encoded body
    encoded_body = event['body']

    body = get_json_body(encoded_body)
    custom_string = body['custom_string']
    if custom_string:
        message_id = custom_string["message_id"]
        stage = custom_string["stage"]

        with DataBase.get_session(stage) as db:
            previous_message = db.query(Message).filter_by(message_id=message_id).first()
            if previous_message:
                new_message = Message()
                new_message.message_id = DataBase.generate_uuid()
                new_message.conversation_id = previous_message.conversation_id
                new_message.created_at = DataBase.get_now()
                new_message.status = 'sent'
                new_message.sender_id = previous_message.receiver_id
                new_message.receiver_id = previous_message.sender_id
                new_message.content = body["message"]
                db.add(new_message)
                conversation = db.query(Conversation).filter_by(conversation_id=new_message.conversation_id).first()
                conversation.updated_at = DataBase.get_now()
                db.commit()
                receiver_admin = db.query(Employee).filter_by(employee_id=new_message.receiver_id).first()
                sender_employee = db.query(Employee).filter_by(employee_id=new_message.sender_id).first()
                domain = 'app.Organizationcred.com'
                if stage != 'prod':
                    domain = domain.replace('app', f'app-{stage}')
                email_body = (f'<BR>Dear {receiver_admin.profile.get_name()}<BR><BR>'
                              f'You have a new text message:<BR>'
                              f'From:\t{sender_employee.profile.phone_number}<BR>'
                              f'To:\t{os.getenv("CLICK_SEND_FROM_NUMBER")}<BR>'
                              f'Received:\t{DataBase.get_now().strftime("%A, %B %d, %Y at %I:%M %p")}<BR>'
                              f'Message:\t{new_message.content}<BR><BR>'
                              f'To reply, click here: {domain}/organization/{sender_employee.organization_id}'
                              f'/user/{sender_employee.employee_id}/conversation<BR><BR>'
                              f'Thank you for using OrganizationCred!')
                SES.send_notification_email(
                    recipient=receiver_admin.profile.email,
                    subject=f'SMS Reply from {sender_employee.profile.get_name()}',
                    body=email_body,
                )
                return {
                    "statusCode": 201,
                    "body": json.dumps(new_message.to_dict())
                }
            else:
                raise Exception(f'No Message found with message_id: {message_id}')


def get_json_body(encoded_body):
    decoded_body = base64.b64decode(encoded_body).decode('utf-8')
    parsed_data = urllib.parse.parse_qs(decoded_body)
    print('PARSED_DATA: ', parsed_data)
    custom_string_value = parsed_data.get('customstring')
    custom_string = {}

    if custom_string_value:
        custom_string_value = custom_string_value[0]
        values = custom_string_value.split('#')
        custom_string = {
            'message_id': values[0],
            'stage': values[1]
        }

    return {
        'custom_string': custom_string,
        'message': parsed_data.get('message')[0]
    }
