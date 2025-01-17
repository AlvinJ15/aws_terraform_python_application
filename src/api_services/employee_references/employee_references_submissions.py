import json
import os
import requests

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import handle_exceptions
from api_services.utils.s3_utils import upload_file_to_s3
from data_models.model_employee_profile import EmployeeProfile
from data_models.model_organization import Organization
from data_models.model_employee_reference import EmployeeReference


@handle_exceptions
def submission_handler(event, context):
    organization_id = ''
    employee_id = ''
    reference_id = ''
    stage = os.environ.get('STAGE')

    body = json.loads(event.get('body'))
    data_answers = body.get('data')
    pdf_url = get_pdf_url(body.get('pdfs'))

    for answer in data_answers:
        if answer.get('custom_key') == 'reference_id':
            reference_id = answer.get('value')
        elif answer.get('custom_key') == 'organization_id':
            organization_id = answer.get('value')
        elif answer.get('custom_key') == 'employee_id':
            employee_id = answer.get('value')
    print(reference_id, organization_id, employee_id)
    with DataBase.get_session(stage) as db:
        organization = db.query(Organization).filter_by(id=organization_id).first()
        employee_profile = db.query(EmployeeProfile).filter_by(employee_id=employee_id).first()
        reference = db.query(EmployeeReference).filter_by(reference_id=reference_id).first()
        file = get_file_from_url(pdf_url)
        path = (f"{stage}/app_data/orgs/{organization.name} {DataBase.get_now().year}/"
                f"Ongoing/{employee_profile.get_name()} - "
                f"{employee_profile.facility}/References/"
                f"{employee_profile.get_name()} - Reference {reference.referee_name}.pdf")
        s3_path = upload_file_to_s3(path, file, 'application/pdf')
        reference.s3_path = s3_path
        reference.status = 'Awaiting Approval'
        db.commit()
        return {
            'statusCode': 201,
            'body': json.dumps(reference.to_dict())
        }


def get_pdf_url(pdfs):
    for key, value in pdfs.items():
        return value.get('url')
    return None


def get_file_from_url(url):
    response = requests.get(url)
    return response.content
