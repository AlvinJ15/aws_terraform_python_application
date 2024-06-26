import json
import base64
import os

from streaming_form_data import StreamingFormDataParser
from streaming_form_data.targets import ValueTarget

from api_services.employees.employees_utils import check_employee_compliance
from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from api_services.utils.s3_utils import upload_file_to_s3, generate_file_link, delete_file_from_s3, \
    list_files_from_path, create_path_to_s3, change_object_name
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
    organization_id = event["pathParameters"]["organization_id"]
    path = event['queryStringParameters']['path']
    if not path:
        path = get_base_path(organization_id)
    path = build_path(stage, path)

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
    json_object = {}
    if 'file_name' in data:
        path = f"{path}{data['file_name']}"
        json_object['upload_url'] = generate_file_link(path, 'put_object', data.get('file_type'))
    else:
        path = f"{path}{data['folder_name']}/"
        create_path_to_s3(path)
    return {
        'statusCode': 201,
        'body': json.dumps(json_object)
    }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    data = json.loads(event["body"])
    json_object = {}
    new_name = data['new_name']
    original_name = data['original_name']
    original_path = os.path.dirname(original_name)
    full_new_name = os.path.join(original_path, new_name)

    if data['original_name'] != full_new_name:
        change_object_name(data['original_name'], full_new_name)

    return {
        'statusCode': 201,
        'body': json.dumps(json_object)
    }


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    data = json.loads(event["body"])
    json_object = {}

    if data['original_name']:
        delete_file_from_s3(data['original_name'])

    return {
        'statusCode': 201,
        'body': json.dumps(json_object)
    }

def build_path(stage, path):
    return f"{stage}/{path}"

def get_base_path(organization_id):
    # Retrieve the JSON-encoded environment variable
    organizations_json = os.getenv('ORGANIZATIONS', '{}')

    # Decode the JSON string into a Python dictionary
    organizations = json.loads(organizations_json)
    return f"app_data/orgs/{organizations.get(organization_id)} "
