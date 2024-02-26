import json
import traceback
import base64

from streaming_form_data import StreamingFormDataParser
from streaming_form_data.targets import ValueTarget

from api_services.utils.database_utils import DataBase
from api_services.utils.s3_utils import upload_file_to_s3
from data_models.model_document_type import DocumentType
from data_models.model_employee_profile import EmployeeProfile
from data_models.model_organization import Organization
from data_models.model_employee_document import EmployeeDocument
from data_models.models import set_fields_from_dict


def get_all_handler(event, context):
    employee_id = event["pathParameters"]["employee_id"]
    with DataBase.get_session() as db:
        try:
            organization_documents = db.query(EmployeeDocument).filter_by(employee_id=employee_id)
            return {"statusCode": 200, "body": json.dumps([document.to_dict() for document in organization_documents])}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving EmployeeDocument: {err}"}


def get_single_handler(event, context):
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session() as db:
        try:
            organization_document = db.query(EmployeeDocument).filter_by(document_id=document_id).first()
            if organization_document:
                return {"statusCode": 200, "body": json.dumps(organization_document.to_dict())}
            else:
                return {"statusCode": 404, "body": "EmployeeDocument not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving EmployeeDocument: {err}"}


def create_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    employee_id = event["pathParameters"]["employee_id"]

    try:
        with DataBase.get_session() as db:
            organization = db.query(Organization).filter_by(id=organization_id).first()
            employee_profile = db.query(EmployeeProfile).filter_by(employee_id=employee_id).first()
            stage = event.get('requestContext', {}).get('stage')
            data = get_data_from_multipart(event)
            file = data.pop('file')
            if not data.get('approver_id'):
                data['approver_id'] = None
            new_document = EmployeeDocument(**data)
            new_document.document_id = DataBase.generate_uuid()
            new_document.employee_id = employee_id
            document_type = db.query(DocumentType).filter_by(id=new_document.document_type_id).first()
            path = (f"{stage}/app_data/orgs/{organization.name} {DataBase.get_now().year}/"
                    f"Ongoing/{employee_profile.get_name()} - "
                    f"{employee_profile.role}/01 License, Certification and Verification/"
                    f"{employee_profile.get_name()} - "
                    f"{document_type.category} - {document_type.name}.{file.multipart_filename.split('.')[-1]}")
            s3_path = upload_file_to_s3(path, file.value, file.multipart_content_type)
            new_document.s3_path = s3_path
            if new_document.status == 'Approved':
                new_document.approval_date = DataBase.get_now()
            new_document.upload_date = DataBase.get_now()
            db.add(new_document)
            db.commit()
        return {
            'statusCode': 201,
            'body': json.dumps(new_document.to_dict())
        }
    except Exception as err:  # Handle general exceptions for robustness
        string_error = traceback.format_exc()
        print(string_error)
        return {"statusCode": 500, "body": f"Error creating EmployeeDocument: {err}"}


def update_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    employee_id = event["pathParameters"]["employee_id"]
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session() as db:
        document = db.query(EmployeeDocument).filter_by(document_id=document_id).first()
        if not document:
            return {'statusCode': 404, 'body': "EmployeeDocument not found"}

        try:
            organization = db.query(Organization).filter_by(id=organization_id).first()
            employee_profile = db.query(EmployeeProfile).filter_by(employee_id=employee_id).first()
            stage = event.get('requestContext', {}).get('stage')
            data = get_data_from_multipart(event)
            file = data.pop('file')
            date_fields = ['expiry_date', 'approval_date', 'upload_date']
            set_fields_from_dict(document, data, date_fields)
            document_type = db.query(DocumentType).filter_by(id=document.document_type_id).first()
            path = (f"{stage}/app_data/orgs/{organization.name} {DataBase.get_now().year}/"
                    f"Ongoing/{employee_profile.get_name()} - "
                    f"{employee_profile.role}/01 License, Certification and Verification/"
                    f"{employee_profile.get_name()} - "
                    f"{document_type.category} - {document_type.name}.{file.multipart_filename.split('.')[-1]}")
            s3_path = upload_file_to_s3(path, file.value, file.multipart_content_type)
            document.s3_path = s3_path
            if document.status == 'Approved':
                document.approval_date = DataBase.get_now()
            document.upload_date = DataBase.get_now()
            db.commit()
            return {
                'statusCode': 201,
                'body': json.dumps(document.to_dict())
            }
        except Exception as err:  # Handle general exceptions for robustness
            return {"statusCode": 500, "body": f"Error creating EmployeeDocument: {err}"}


def delete_single_handler(event, context):
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session() as db:
        try:
            organization_document = db.query(EmployeeDocument).filter_by(document_id=document_id).first()
            if organization_document:
                db.delete(organization_document)
                db.commit()  # Commit the deletion to the database
                return {"statusCode": 200, "body": json.dumps({"deleted_id": organization_document.document_id})}
            else:
                return {"statusCode": 404, "body": "EmployeeDocument not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error deleting EmployeeDocument: {err}"}


def get_data_from_multipart(event):
    parser = StreamingFormDataParser(headers=event['headers'])

    document_type_id_target = ValueTarget()
    expiry_date_target = ValueTarget()
    document_number_target = ValueTarget()
    status_target = ValueTarget()
    approver_id_target = ValueTarget()
    file_target = ValueTarget()

    parser.register("document_type_id", document_type_id_target)
    parser.register("expiry_date", expiry_date_target)
    parser.register("document_number", document_number_target)
    parser.register("status", status_target)
    parser.register("approver_id", approver_id_target)
    parser.register("file", file_target)

    my_data = base64.b64decode(event["body"])
    parser.data_received(my_data)

    return {
        'document_type_id': document_type_id_target.value.decode("utf-8"),
        'expiry_date': expiry_date_target.value.decode("utf-8"),
        'document_number': document_number_target.value.decode("utf-8"),
        'status': status_target.value.decode("utf-8"),
        'approver_id': approver_id_target.value.decode("utf-8"),
        'file': file_target
    }
