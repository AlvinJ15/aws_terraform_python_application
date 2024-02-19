import json

from api_services.utils.database_utils import DataBase
from data_models.model_compliance_package import CompliancePackage
from data_models.model_package_document import PackageDocument
from data_models.model_package_role import PackageRole
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
                package_id=compliance_package_id
            ).first()
            if compliance_package:
                return {"statusCode": 200, "body": json.dumps(compliance_package.to_dict())}
            else:
                return {"statusCode": 404, "body": "CompliancePackage not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving CompliancePackage: {err}"}


def create_handler(event, context):
    data = json.loads(event["body"])
    organization_id = event["pathParameters"]["organization_id"]

    with DataBase.get_session() as db:
        try:
            new_compliance_package = CompliancePackage(**data)
            new_compliance_package.package_id = DataBase.generate_uuid()
            new_compliance_package.organization_id = organization_id
            new_compliance_package.creation_date = DataBase.get_now()
            db.add(new_compliance_package)
            db.flush()
            roles = data.get("roles", [])
            for role_id in roles:
                new_package_role = PackageRole()
                new_package_role.package_id = new_compliance_package.package_id
                new_package_role.role_id = role_id
                db.add(new_package_role)
            document_types = data.get("document_types", [])
            for document_type_id in document_types:
                new_package_document = PackageDocument()
                new_package_document.package_id = new_compliance_package.package_id
                new_package_document.document_type_id = document_type_id
                db.add(new_package_document)
            db.commit()
            new_compliance_package = db.query(CompliancePackage).filter_by(
                package_id=new_compliance_package.package_id
            ).first()
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
                compliance_package.name = data.get('name', compliance_package.name)

                current_request_roles = data.get('roles', [])
                roles_ids = []
                # Deleting the existing roles for the current steps if the request doesn't have them
                for role in compliance_package.roles:
                    if role.role_id not in current_request_roles:
                        db.query(PackageRole).filter_by(package_id=compliance_package.package_id,
                                                        role_id=role.role_id).delete()
                    else:
                        roles_ids.append(role.role_id)

                # Adding new roles which are presented in the request, but not in the compliance_package
                for role in current_request_roles:
                    if role not in roles_ids:
                        new_role = PackageRole()
                        new_role.package_id = compliance_package.package_id
                        new_role.role_id = role
                        db.add(new_role)

                current_request_documents = data.get('document_types', [])
                documents_ids = []
                # Deleting the existing documents for the current compliance_package if the request doesn't have them
                for document in compliance_package.document_types:
                    if document.id not in current_request_documents:
                        db.query(PackageDocument).filter_by(
                            package_id=compliance_package.package_id, document_type_id=document.id
                        ).delete()
                    else:
                        documents_ids.append(document.id)

                # Adding new roles which are presented in the request, but not in the compliance_package
                for document in current_request_documents:
                    if document not in documents_ids:
                        new_package_document = PackageDocument()
                        new_package_document.package_id = compliance_package.package_id
                        new_package_document.document_type_id = document
                        db.add(new_package_document)

                db.commit()
                compliance_package = db.query(CompliancePackage).filter_by(
                    package_id=compliance_package.package_id
                ).first()
                return {"statusCode": 200, "body": json.dumps(compliance_package.to_dict())}
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
