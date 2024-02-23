import json
import traceback
import base64

from sqlalchemy import func
from streaming_form_data import StreamingFormDataParser
from streaming_form_data.targets import ValueTarget

from api_services.utils.database_utils import DataBase
from api_services.utils.s3_utils import upload_file_to_s3
from api_services.utils.ses_utils import urlencode_dict, SES
from data_models.model_employee import Employee
from data_models.model_employee_profile import EmployeeProfile
from data_models.model_organization import Organization
from data_models.model_employee_reference import EmployeeReference
from data_models.models import update_object_from_dict


def get_all_handler(event, context):
    employee_id = event["pathParameters"]["employee_id"]
    with DataBase.get_session() as db:
        try:
            employee_references = db.query(EmployeeReference).filter_by(employee_id=employee_id)
            return {"statusCode": 200, "body": json.dumps([reference.to_dict() for reference in employee_references])}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving EmployeeReference: {err}"}


def get_single_handler(event, context):
    reference_id = event["pathParameters"]["reference_id"]

    with DataBase.get_session() as db:
        try:
            reference = db.query(EmployeeReference).filter_by(reference_id=reference_id).first()
            if reference:
                return {"statusCode": 200, "body": json.dumps(reference.to_dict())}
            else:
                return {"statusCode": 404, "body": "EmployeeReference not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving EmployeeReference: {err}"}


def create_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    employee_id = event["pathParameters"]["employee_id"]

    try:
        with DataBase.get_session() as db:
            organization = db.query(Organization).filter_by(id=organization_id).first()
            employee_profile = db.query(EmployeeProfile).filter_by(employee_id=employee_id).first()
            if 'multipart/form-data' in event.get('headers', {}).get('Content-Type', ''):
                stage = event.get('requestContext', {}).get('stage')
                data = get_data_from_multipart(event)
                file = data.pop('file')
                new_reference = EmployeeReference(**data)
                new_reference.reference_id = DataBase.generate_uuid()

                path = (f"{stage}/app_data/orgs/{organization.name} {DataBase.get_now().year}/"
                        f"Ongoing/{employee_profile.get_name()} - "
                        f"{employee_profile.role}/References/"
                        f"{employee_profile.get_name()} - Reference {new_reference.reference_id}."
                        f"{file.multipart_filename.split('.')[-1]}")
                s3_path = upload_file_to_s3(path, file.value, file.multipart_content_type)
                new_reference.s3_path = s3_path
            else:
                data = json.loads(event.get('body', '{}'))
                DataBase.pop_non_updatable_fields(
                    ['created_date', 'completion_date', 'reference_id', 'employee_id', 's3_path'], data
                )
                new_reference = EmployeeReference(**data)
                new_reference.reference_id = DataBase.generate_uuid()
                new_reference.created_date = DataBase.get_now()
                query_parameters = {
                    'organization_id': organization_id,
                    'employee_id': employee_id,
                    'reference_id': new_reference.reference_id
                }
                subject = f'Reference request for {employee_profile.get_name()}'
                body_mail = (f'Please send you reference for {employee_profile.get_name()}\n'
                             f'https://tollaniscred.paperform.co/?{urlencode_dict(query_parameters)}')
                mail_result = SES.send_email(new_reference.referee_email, subject, body_mail)
            if new_reference.status == 'Approved':
                new_reference.completion_date = DataBase.get_now()
            else:
                new_reference.completion_date = None
            new_reference.employee_id = employee_id
            db.add(new_reference)
            db.commit()
            return {
                'statusCode': 201,
                'body': json.dumps(new_reference.to_dict())
            }
    except Exception as err:  # Handle general exceptions for robustness
        string_error = traceback.format_exc()
        print(string_error)
        return {"statusCode": 500, "body": f"Error creating EmployeeReference: {err}"}


def update_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    employee_id = event["pathParameters"]["employee_id"]
    reference_id = event["pathParameters"]["reference_id"]

    try:
        with DataBase.get_session() as db:
            organization = db.query(Organization).filter_by(id=organization_id).first()
            employee_profile = db.query(EmployeeProfile).filter_by(employee_id=employee_id).first()
            reference = db.query(EmployeeReference).filter_by(reference_id=reference_id).first()
            if reference is None:
                return {"statusCode": 404, "body": "EmployeeReference not found"}
            if 'multipart/form-data' in event.get('headers', {}).get('Content-Type', ''):
                stage = event.get('requestContext', {}).get('stage')
                data = get_data_from_multipart(event)
                file = data.pop('file')
                DataBase.pop_non_updatable_fields(
                    ['created_date', 'completion_date', 'reference_id', 'employee_id', 's3_path'], data
                )
                update_object_from_dict(reference, data)
                path = (f"{stage}/app_data/orgs/{organization.name} {DataBase.get_now().year}/"
                        f"Ongoing/{employee_profile.get_name()} - "
                        f"{employee_profile.role}/References/"
                        f"{employee_profile.get_name()} - Reference {reference.reference_id}."
                        f"{file.multipart_filename.split('.')[-1]}")
                s3_path = upload_file_to_s3(path, file.value, file.multipart_content_type)
                reference.s3_path = s3_path
            else:
                data = json.loads(event.get('body', '{}'))
                DataBase.pop_non_updatable_fields(
                    ['created_date', 'completion_date', 'reference_id', 'employee_id', 's3_path'], data
                )
                update_object_from_dict(reference, data)
                query_parameters = {
                    'organization_id': organization_id,
                    'employee_id': employee_id,
                    'reference_id': reference.reference_id
                }
                subject = f'Reference request for {employee_profile.get_name()}'
                body_mail = (f'Please send you reference for {employee_profile.get_name()}\n'
                             f'https://tollaniscred.paperform.co/?{urlencode_dict(query_parameters)}')
                mail_result = SES.send_email(reference.referee_email, subject, body_mail)
            if reference.status == 'Approved':
                reference.completion_date = DataBase.get_now()
            else:
                reference.completion_date = None
            db.add(reference)
            db.commit()
            approved_count = db.query(func.count(EmployeeReference.reference_id)).filter_by(
                employee_id=employee_id, status='Approved'
            ).scalar()
            if approved_count >= 2:
                employee = db.query(Employee).filter_by(employee_id=employee_id).first()
                employee.user_tags = employee.user_tags + 'references_ok'
                db.commit()
            return {
                'statusCode': 200,
                'body': json.dumps(reference.to_dict())
            }
    except Exception as err:  # Handle general exceptions for robustness
        string_error = traceback.format_exc()
        print(string_error)
        return {"statusCode": 500, "body": f"Error updating EmployeeReference: {err}"}


def delete_single_handler(event, context):
    reference_id = event["pathParameters"]["reference_id"]

    with DataBase.get_session() as db:
        try:
            employee_reference = db.query(EmployeeReference).filter_by(reference_id=reference_id).first()
            if employee_reference:
                db.delete(employee_reference)
                db.commit()  # Commit the deletion to the database
                return {"statusCode": 200, "body": json.dumps({"deleted_id": employee_reference.reference_id})}
            else:
                return {"statusCode": 404, "body": "EmployeeReference not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error deleting EmployeeReference: {err}"}


def get_data_from_multipart(event):
    parser = StreamingFormDataParser(headers=event['headers'])

    name_target = ValueTarget()
    email_target = ValueTarget()
    phone_target = ValueTarget()
    status_target = ValueTarget()
    file_target = ValueTarget()

    parser.register("referee_name", name_target)
    parser.register("referee_email", email_target)
    parser.register("referee_phone", phone_target)
    parser.register("status", status_target)
    parser.register("file", file_target)

    my_data = base64.b64decode(event["body"])
    parser.data_received(my_data)

    return {
        'referee_name': name_target.value.decode("utf-8"),
        'referee_email': email_target.value.decode("utf-8"),
        'referee_phone': phone_target.value.decode("utf-8"),
        'status': status_target.value.decode("utf-8"),
        'file': file_target
    }
