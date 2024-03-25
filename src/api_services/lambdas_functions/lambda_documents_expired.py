import traceback
from datetime import datetime

from api_services.utils.database_utils import DataBase
from api_services.utils.error_utils import print_exception_stack
from api_services.utils.wrappers_utils import set_stage
from data_models.model_employee import Employee
from data_models.model_employee_document import EmployeeDocument


@set_stage
def expired_handler(event, context, stage):
    try:
        with DataBase.get_session('prod') as db:
            current_datetime = datetime.now()
            employee_documents = db.query(EmployeeDocument).filter(
                (EmployeeDocument.expiry_date < current_datetime)
            ).order_by(EmployeeDocument.employee_id)

            for document in employee_documents:
                document.status = 'Expired'
            employee_ids = [doc.employee_id for doc in employee_documents]
            employees = db.query(Employee).filter(Employee.employee_id.in_(employee_ids)).all()
            for employee in employees:
                if employee.compliance_tags:
                    if 'DOCUMENTS_EXPIRY_SOON' in employee.compliance_tags:
                        employee.compliance_tags = employee.compliance_tags.replace('DOCUMENTS_EXPIRY_SOON', '')
                    if 'DOCUMENTS_EXPIRED' not in employee.compliance_tags:
                        employee.compliance_tags += ',DOCUMENTS_EXPIRED'
                else:
                    employee.compliance_tags = 'DOCUMENTS_EXPIRED'
            db.commit()
            return {
                'statusCode': 201,
                'body': 'Successfully updated documents expired'
            }
    except Exception as err:  # Handle general exceptions for robustness
        print_exception_stack()
        return {"statusCode": 500, "body": f"Error creating EmployeeReference: {err}"}


def build_paragraph(employee_document: EmployeeDocument, employee: Employee):
    profile = employee.profile
    return (f'{employee.organization.name},{profile.first_name} {profile.last_name},{profile.email},'
            f'{employee_document.document_type.name},{employee_document.expiry_date.strftime("%Y-%m-%d %H:%M:%S")}')
