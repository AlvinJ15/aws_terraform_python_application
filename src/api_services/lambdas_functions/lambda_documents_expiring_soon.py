import traceback

from datetime import datetime, timedelta

from api_services.utils.database_utils import DataBase
from api_services.utils.ses_utils import SES
from api_services.utils.wrappers_utils import set_stage
from data_models.model_employee import Employee
from data_models.model_employee_document import EmployeeDocument


@set_stage
def expiry_soon_handler(event, context, stage):
    try:
        with DataBase.get_session('prod') as db:
            current_datetime = datetime.now()
            sixty_days_from_now = current_datetime + timedelta(days=60)
            employee_documents = db.query(EmployeeDocument).filter(
                (EmployeeDocument.expiry_date >= current_datetime) &
                (EmployeeDocument.expiry_date <= sixty_days_from_now)
            ).order_by(EmployeeDocument.employee_id)

            for document in employee_documents:
                document.status = 'Expires soon'
            employee_ids = [doc.employee_id for doc in employee_documents]
            employees = db.query(Employee).filter(Employee.employee_id.in_(employee_ids)).all()
            employees_dict = {}
            for employee in employees:
                employees_dict[employee.employee_id] = employee
                if employee.compliance_tags:
                    if 'DOCUMENTS_EXPIRY_SOON' not in employee.compliance_tags:
                        employee.compliance_tags += ',DOCUMENTS_EXPIRY_SOON'
                else:
                    employee.compliance_tags = 'DOCUMENTS_EXPIRY_SOON'

            body = '<BR>'.join([
                build_paragraph(document, employees_dict[document.employee_id]) for document in employee_documents
            ])
            body = f'<BR>{body}<BR><BR>'
            SES.send_email_credentially('credentialing@tollanis.com', 'EXPIRING SOON DOCUMENTS', body)
            return {
                'statusCode': 201,
                'body': body
            }
    except Exception as err:  # Handle general exceptions for robustness
        string_error = traceback.format_exc()
        print(string_error)
        return {"statusCode": 500, "body": f"Error creating EmployeeReference: {err}"}


def build_paragraph(employee_document: EmployeeDocument, employee: Employee):
    profile = employee.profile
    return (f'{employee.organization.name},{profile.first_name} {profile.last_name},{profile.email},'
            f'{employee_document.document_type.name},{employee_document.expiry_date.strftime("%Y-%m-%d %H:%M:%S")}')
