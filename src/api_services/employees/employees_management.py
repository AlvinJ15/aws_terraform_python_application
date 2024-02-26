import json

from api_services.utils.database_utils import DataBase
from api_services.utils.s3_utils import create_path_to_s3
from data_models.model_employee import Employee
from data_models.model_employee_profile import EmployeeProfile
from data_models.model_organization import Organization
from data_models.models import update_object_from_dict, set_fields_from_dict


def get_all_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session() as db:
        try:
            employees = db.query(Employee).filter_by(organization_id=organization_id).limit(100)
            return {"statusCode": 200,
                    "body": json.dumps([employee.to_dict() for employee in employees])}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving Employee: {err}"}


def get_single_handler(event, context):
    employee_id = event["pathParameters"]["employee_id"]

    with DataBase.get_session() as db:
        try:
            employee = db.query(Employee).filter_by(employee_id=employee_id).first()
            if employee:
                json_object = employee.to_dict()
                json_object['compliance_packages'] = [package.to_dict() for package in employee.compliance_packages]
                return {"statusCode": 200, "body": json.dumps(json_object)}
            else:
                return {"statusCode": 404, "body": "Employee not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving Employee: {err}"}


def create_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session() as db:
        try:
            profile = data.get("profile", {})
            if 'profile' in data:
                data.pop('profile')
            new_employee = Employee(**data)
            new_employee.employee_id = DataBase.generate_uuid()
            new_employee.created = DataBase.get_now()
            new_employee.organization_id = organization_id
            db.add(new_employee)
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
                    f"{new_employee_profile.role}")
            create_path_to_s3(path)
            return {"statusCode": 201, "body": json.dumps(new_employee.to_dict())}
        except Exception as err:  # Handle general exceptions for robustness
            return {"statusCode": 500, "body": f"Error creating Employee: {err}"}


def update_handler(event, context):
    employee_id = event["pathParameters"]["employee_id"]
    data = json.loads(event["body"])

    with DataBase.get_session() as db:
        try:
            employee = db.query(Employee).filter_by(
                employee_id=employee_id
            ).first()
            if employee:
                # employee_id is not an updatable attribute
                profile = data.get("profile", {})
                DataBase.pop_non_updatable_fields(["employee_id", "organization_id", "profile", "created"], data)
                updated_employee = update_object_from_dict(employee, data)
                DataBase.pop_non_updatable_fields(["profile_id", "employee_id"], profile)
                set_fields_from_dict(employee.profile, profile, ['date_of_birth'])
                db.commit()
                return {"statusCode": 200, "body": json.dumps(updated_employee.to_dict())}
            else:
                return {"statusCode": 404, "body": "Employee not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error updating Employee: {err}"}


def delete_single_handler(event, context):
    employee_id = event["pathParameters"]["employee_id"]

    with DataBase.get_session() as db:
        try:
            profile = db.query(EmployeeProfile).filter_by(employee_id=employee_id).first()
            employee = db.query(Employee).filter_by(employee_id=employee_id).first()
            if employee:
                db.delete(profile)
                db.flush()
                db.delete(employee)
                db.commit()  # Commit the deletion to the database
                return {"statusCode": 200, "body": json.dumps({"deleted_id": employee.employee_id})}
            else:
                return {"statusCode": 404, "body": "Employee not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error deleting Employee: {err}"}
