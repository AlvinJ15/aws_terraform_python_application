from datetime import datetime

from api_services.lambdas_functions.lambda_documents_expiring_soon import build_employee_row, build_employee_header
from api_services.utils.csv_utils import create_csv_in_memory
from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import handle_exceptions, set_stage
from api_services.utils.ses_utils import SES
from data_models.model_employee import Employee
from data_models.model_employee_document import EmployeeDocument


@handle_exceptions
@set_stage
def expired_handler(event, context, stage):
    with DataBase.get_session('prod') as db:
        current_datetime = datetime.now()
        employee_documents = db.query(EmployeeDocument).filter(
            (EmployeeDocument.expiry_date < current_datetime)
        ).order_by(EmployeeDocument.employee_id)
        employees_dict = {}

        for document in employee_documents:
            document.status = 'Expired'
        employee_ids = [doc.employee_id for doc in employee_documents]
        employees = db.query(Employee).filter(Employee.employee_id.in_(employee_ids)).all()
        for employee in employees:
            employees_dict[employee.employee_id] = employee
            if employee.compliance_tags:
                if 'DOCUMENTS_EXPIRY_SOON' in employee.compliance_tags:
                    employee.compliance_tags = employee.compliance_tags.replace('DOCUMENTS_EXPIRY_SOON', '')
                if 'DOCUMENTS_EXPIRED' not in employee.compliance_tags:
                    employee.compliance_tags += ',DOCUMENTS_EXPIRED'
            else:
                employee.compliance_tags = 'DOCUMENTS_EXPIRED'
            employee.status = 'NOT_COMPLIANT'

        rows = [
            build_employee_row(document, employees_dict[document.employee_id]) for document in employee_documents
        ]
        body = '<BR>Expired Employee Documents Attached<BR><BR>'
        csv_file = create_csv_in_memory(build_employee_header(), rows)
        SES.send_email_credentially(
            'credentialing@tollanis.com', 'EXPIRED DOCUMENTS',
            body, csv_file, 'expired_documents.csv'
        )
        db.commit()

        return {
            'statusCode': 201,
            'body': 'Successfully updated documents expired'
        }


def build_paragraph(employee_document: EmployeeDocument, employee: Employee):
    profile = employee.profile
    return (f'{employee.organization.name},{profile.first_name} {profile.last_name},{profile.email},'
            f'{employee_document.document_type.name},{employee_document.expiry_date.strftime("%Y-%m-%d %H:%M:%S")}')
