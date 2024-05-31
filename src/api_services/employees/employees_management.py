import json

from api_services.employees.employees_utils import get_employees_with_filter, notify_assignee
from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from api_services.utils.s3_utils import create_path_to_s3, delete_file_from_s3, delete_entire_folder
from data_models.model_employee import Employee
from data_models.model_employee_compliance_package import EmployeeCompliancePackage
from data_models.model_employee_document import EmployeeDocument
from data_models.model_employee_profile import EmployeeProfile
from data_models.model_employee_questionnaire_response import EmployeeQuestionnaireResponse
from data_models.model_employee_reference import EmployeeReference
from data_models.model_organization import Organization
from data_models.model_user import User
from data_models.models import update_object_from_dict, set_fields_from_dict


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    page_number = int(event['queryStringParameters'].get('page', 1))
    has_filters = event['queryStringParameters'].get('filters', False)
    offset = (page_number - 1) * 1000
    with DataBase.get_session(stage) as db:
        if has_filters:
            query = get_employees_with_filter(db, organization_id, event['queryStringParameters'])
            employees = query.limit(1000).offset(offset).all()
        else:
            employees = (
                db.query(Employee).filter_by(organization_id=organization_id).join(EmployeeProfile)
                .order_by(EmployeeProfile.first_name.asc()).limit(1000).offset(offset).all())
        return {
            "statusCode": 200,
            "body": json.dumps([employee.to_dict() for employee in employees])
        }


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    employee_id = event["pathParameters"]["employee_id"]

    with DataBase.get_session(stage) as db:
        employee = db.query(Employee).filter_by(employee_id=employee_id).first()
        if employee:
            json_object = employee.to_dict()
            json_object['compliance_packages'] = [package.to_dict() for package in employee.compliance_packages]
            return {
                "statusCode": 200,
                "body": json.dumps(json_object)
            }
        else:
            return {"statusCode": 404, "body": "Employee not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        profile = data.get("profile", {})
        if 'profile' in data:
            data.pop('profile')
        new_employee = Employee(**data)
        new_employee.employee_id = DataBase.generate_uuid()
        new_employee.created = DataBase.get_now()
        new_employee.organization_id = organization_id
        db.add(new_employee)
        new_user = User()
        new_user.user_id = new_employee.employee_id
        new_user.created_at = DataBase.get_now()
        db.add(new_user)
        db.flush()

        new_employee_profile = EmployeeProfile(**profile)
        new_employee_profile.profile_id = DataBase.generate_uuid()
        new_employee_profile.employee_id = new_employee.employee_id
        db.add(new_employee_profile)
        db.commit()
        db.refresh(new_employee)
        stage = event.get('requestContext', {}).get('stage')
        organization = db.query(Organization).filter_by(id=organization_id).first()
        path = (f"{stage}/app_data/orgs/{organization.name} {DataBase.get_now().year}/"
                f"Ongoing/{new_employee_profile.first_name} {new_employee_profile.last_name} - "
                f"{new_employee_profile.facility}/")
        create_path_to_s3(path)
        return {
            "statusCode": 201,
            "body": json.dumps(new_employee.to_dict())
        }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    employee_id = event["pathParameters"]["employee_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        employee = db.query(Employee).filter_by(
            employee_id=employee_id
        ).first()
        if employee:
            send_notification_assignee = 'assignee_id' in data and data['assignee_id'] != employee.assignee_id
            # employee_id is not an updatable attribute
            profile = data.get("profile", {})
            new_packages = data.get("compliance_packages", None)
            DataBase.pop_non_updatable_fields([
                "employee_id", "organization_id", "profile", "created", "compliance_packages"
            ], data)
            updated_employee = update_object_from_dict(employee, data)
            DataBase.pop_non_updatable_fields(["profile_id", "employee_id"], profile)
            set_fields_from_dict(employee.profile, profile, ['date_of_birth'])
            if new_packages:
                current_packages = db.query(EmployeeCompliancePackage).filter_by(employee_id=employee_id)
                current_packages_id = [package.package_id for package in current_packages]
                for current_package in current_packages:
                    if current_package.package_id not in new_packages:
                        db.delete(current_package)
                for new_package in new_packages:
                    if new_package not in current_packages_id:
                        new_employee_package = EmployeeCompliancePackage()
                        new_employee_package.package_id = DataBase.generate_uuid()
                        new_employee_package.employee_id = employee_id
                        new_employee_package.package_id = new_package
                        db.add(new_employee_package)
            db.commit()
            db.refresh(employee)
            if send_notification_assignee:
                notify_assignee(db, stage, employee, data)
            return {
                "statusCode": 200,
                "body": json.dumps(updated_employee.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "Employee not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    employee_id = event["pathParameters"]["employee_id"]

    with DataBase.get_session(stage) as db:
        employee = db.query(Employee).filter_by(employee_id=employee_id).first()
        if employee:
            path = (f"{stage}/app_data/orgs/{employee.organization.name} {DataBase.get_now().year}/"
                    f"Ongoing/{employee.profile.first_name} {employee.profile.last_name} - "
                    f"{employee.profile.facility}")
            db.query(EmployeeCompliancePackage).filter_by(employee_id=employee_id).delete()
            db.query(EmployeeProfile).filter_by(employee_id=employee_id).delete()
            db.query(EmployeeDocument).filter_by(employee_id=employee_id).delete()
            db.query(EmployeeQuestionnaireResponse).filter_by(employee_id=employee_id).delete()
            db.query(EmployeeReference).filter_by(employee_id=employee_id).delete()
            delete_entire_folder(path)
            db.flush()
            db.delete(employee)
            db.commit()  # Commit the deletion to the database
            return {
                "statusCode": 200,
                "body": json.dumps({"deleted_id": employee.employee_id})
            }
        else:
            return {"statusCode": 404, "body": "Employee not found"}
