import json
import base64

from streaming_form_data import StreamingFormDataParser
from streaming_form_data.targets import ValueTarget

from api_services.employees.employees_utils import check_employee_compliance
from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from api_services.utils.s3_utils import upload_file_to_s3, generate_file_link, delete_file_from_s3, list_files_from_path
from data_models.model_document_type import DocumentType
from data_models.model_employee import Employee
from data_models.model_employee_profile import EmployeeProfile
from data_models.model_organization import Organization
from data_models.model_employee_document import EmployeeDocument
from data_models.models import set_fields_from_dict


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    path = build_path(stage, event['queryStringParameters']['path'])
    print("PATH:", path)
    files = list_files_from_path(path)
    print(files)
    return {
        "statusCode": 200,
        "body": json.dumps({
            "files": files
        })
    }


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    path = build_path(stage, event['queryStringParameters']['path'])
    json_object = {'download_url': generate_file_link(path)}
    return {
        "statusCode": 200,
        "body": json.dumps(json_object)
    }


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    path = build_path(stage, event['queryStringParameters']['path'])
    data = json.loads(event["body"])
    path = f"{path}/{data['file_name']}"
    json_object = {}
    json_object['upload_url'] = generate_file_link(path, 'put_object', data.get('file_type'))
    return {
        'statusCode': 201,
        'body': json.dumps(json_object)
    }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    employee_id = event["pathParameters"]["employee_id"]
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session(stage) as db:
        document = db.query(EmployeeDocument).filter_by(document_id=document_id).first()
        if not document:
            return {'statusCode': 404, 'body': "EmployeeDocument not found"}

        organization = db.query(Organization).filter_by(id=organization_id).first()
        employee_profile = db.query(EmployeeProfile).filter_by(employee_id=employee_id).first()
        employee = db.query(Employee).filter_by(employee_id=employee_id).first()

        data = get_data_from_multipart(event)
        file_name = None
        upload_url = None
        if 'file_name' in data:
            file_name = data.pop('file_name')
            file_type = data.pop('file_type')
        date_fields = ['expiry_date', 'approval_date', 'upload_date']
        set_fields_from_dict(document, data, date_fields)
        if file_name:
            document_type = db.query(DocumentType).filter_by(id=document.document_type_id).first()
            path = (f"{stage}/app_data/orgs/{organization.name} {DataBase.get_now().year}/"
                    f"Ongoing/{employee_profile.get_name()} - "
                    f"{employee_profile.facility}/01 License, Certification and Verification/"
                    f"{employee_profile.get_name()} - "
                    f"{document_type.category} - {document_type.name}.{file_name.split('.')[-1]}")
            document.s3_path = path
            document.upload_date = DataBase.get_now()
            upload_url = generate_file_link(path, 'put_object', file_type)
        if data.get('status') == 'Approved':
            document.approval_date = DataBase.get_now()
        if data.get('expiry_date') and document.expiry_date and document.expiry_date > DataBase.get_now():
            document.status = 'Awaiting Approval'
        db.commit()
        check_employee_compliance(db, employee)
        dict_document = document.to_dict()
        dict_document['upload_url'] = upload_url
        return {
            'statusCode': 201,
            'body': json.dumps(dict_document)
        }


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session(stage) as db:
        employee_document = db.query(EmployeeDocument).filter_by(document_id=document_id).first()
        employee = db.query(Employee).filter_by(employee_id=employee_document.employee_id).first()
        document_path = employee_document.s3_path
        if employee_document:
            db.delete(employee_document)
            db.commit()  # Commit the deletion to the database
            check_employee_compliance(db, employee)
            delete_file_from_s3(document_path)
            return {
                "statusCode": 200,
                "body": json.dumps({"deleted_id": employee_document.document_id})
            }
        else:
            return {"statusCode": 404, "body": "EmployeeDocument not found"}


def get_data_from_multipart(event):
    parser = StreamingFormDataParser(headers=event['headers'])

    document_type_id_target = ValueTarget()
    expiry_date_target = ValueTarget()
    document_number_target = ValueTarget()
    status_target = ValueTarget()
    approver_id_target = ValueTarget()
    file_target = ValueTarget()
    file_type_target = ValueTarget()
    file_name_target = ValueTarget()

    parser.register("document_type_id", document_type_id_target)
    parser.register("expiry_date", expiry_date_target)
    parser.register("document_number", document_number_target)
    parser.register("status", status_target)
    parser.register("approver_id", approver_id_target)
    parser.register("file", file_target)
    parser.register("file_type", file_type_target)
    parser.register("file_name", file_name_target)

    my_data = base64.b64decode(event["body"])
    parser.data_received(my_data)

    values = {
        'document_type_id': document_type_id_target.value.decode("utf-8"),
        'expiry_date': expiry_date_target.value.decode("utf-8"),
        'document_number': document_number_target.value.decode("utf-8"),
        'status': status_target.value.decode("utf-8"),
        'approver_id': approver_id_target.value.decode("utf-8"),
        'file': file_target if file_target.value else None,
        'file_type': file_type_target.value.decode('utf-8'),
        'file_name': file_name_target.value.decode('utf-8')
    }

    return {key: value for key, value in values.items() if value}


def build_path(stage, path):
    return f"{stage}/{path}"