import json

from api_services.utils.database_utils import DataBase
from data_models.model_compliance_package import CompliancePackage
from data_models.models import update_object_from_dict


def get_all_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session() as db:
        try:
            compliance_packages = db.query(CompliancePackage).filter_by(organization_id=organization_id)
            return {
                "statusCode": 200, "body": json.dumps([compliance_package.to_dict()
                                                       for compliance_package in compliance_packages])
            }
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving CompliancePackage: {err}"}


def get_single_handler(event, context):
    compliance_package_id = event["pathParameters"]["package_id"]

    with DataBase.get_session() as db:
        try:
            compliance_package = db.query(CompliancePackage).filter_by(
                compliance_package_id=compliance_package_id
            ).first()
            if compliance_package:
                return {"statusCode": 200, "body": json.dumps(compliance_package.to_dict())}
            else:
                return {"statusCode": 404, "body": "CompliancePackage not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving CompliancePackage: {err}"}


def create_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session() as db:
        try:
            new_compliance_package = CompliancePackage(**data)
            new_compliance_package.organization_id = organization_id
            new_compliance_package.creation_date = DataBase.get_now()
            new_compliance_package.package_id = DataBase.generate_uuid()
            db.add(new_compliance_package)
            db.commit()
            return {"statusCode": 201, "body": json.dumps(new_compliance_package.to_dict())}
        except Exception as err:  # Handle general exceptions for robustness
            return {"statusCode": 500, "body": f"Error creating CompliancePackage: {err}"}


def update_handler(event, context):
    compliance_package_id = event["pathParameters"]["package_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session() as db:
        try:
            compliance_package = db.query(CompliancePackage).filter_by(
                package_id=compliance_package_id, organization_id=organization_id
            ).first()
            if compliance_package:
                # package_id is not an updatable attribute
                if "package_id" in data:
                    data.pop("package_id")
                updated_compliance_package = update_object_from_dict(compliance_package, data)
                db.commit()
                return {"statusCode": 200, "body": json.dumps(updated_compliance_package.to_dict())}
            else:
                return {"statusCode": 404, "body": "CompliancePackage not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error updating CompliancePackage: {err}"}


def delete_single_handler(event, context):
    package_id = event["pathParameters"]["package_id"]

    with DataBase.get_session() as db:
        try:
            compliance_package = db.query(CompliancePackage).filter_by(package_id=package_id).first()
            if compliance_package:
                db.delete(compliance_package)
                db.commit()  # Commit the deletion to the database
                return {"statusCode": 200, "body": json.dumps({"deleted_id": compliance_package.package_id})}
            else:
                return {"statusCode": 404, "body": "CompliancePackage not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error deleting CompliancePackage: {err}"}
