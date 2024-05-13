import json

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_compliance_package import CompliancePackage
from data_models.model_employee_compliance_package import EmployeeCompliancePackage
from data_models.model_package_document import PackageDocument
from data_models.model_package_facility import PackageFacility


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session(stage) as db:
        compliance_packages = db.query(CompliancePackage).filter_by(organization_id=organization_id)
        return {
            "statusCode": 200,
            "body": json.dumps([compliance_package.to_dict()
                                for compliance_package in compliance_packages])
        }


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    compliance_package_id = event["pathParameters"]["package_id"]

    with DataBase.get_session(stage) as db:
        compliance_package = db.query(CompliancePackage).filter_by(
            package_id=compliance_package_id
        ).first()
        if compliance_package:
            return {
                "statusCode": 200,
                "body": json.dumps(compliance_package.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "CompliancePackage not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    data = json.loads(event["body"])
    organization_id = event["pathParameters"]["organization_id"]

    with DataBase.get_session(stage) as db:
        facilities = data.pop("facilities", [])
        document_types = data.pop("document_types", [])
        new_compliance_package = CompliancePackage(**data)
        new_compliance_package.package_id = DataBase.generate_uuid()
        new_compliance_package.organization_id = organization_id
        new_compliance_package.creation_date = DataBase.get_now()
        db.add(new_compliance_package)
        db.flush()
        for facility_id in facilities:
            new_package_facility = PackageFacility()
            new_package_facility.package_id = new_compliance_package.package_id
            new_package_facility.facility_id = facility_id
            db.add(new_package_facility)
        for document_type_id in document_types:
            new_package_document = PackageDocument()
            new_package_document.package_id = new_compliance_package.package_id
            new_package_document.document_type_id = document_type_id
            db.add(new_package_document)
        db.commit()
        db.refresh(new_compliance_package)
        return {
            "statusCode": 201,
            "body": json.dumps(new_compliance_package.to_dict())
        }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    compliance_package_id = event["pathParameters"]["package_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        compliance_package = db.query(CompliancePackage).filter_by(
            package_id=compliance_package_id, organization_id=organization_id
        ).first()
        if compliance_package:
            compliance_package.name = data.get('name', compliance_package.name)

            current_request_facilities = data.get('facilities', [])
            facilities_ids = []
            # Deleting the existing facilities for the current steps if the request doesn't have them
            for facility in compliance_package.facilities:
                if facility.facility_id not in current_request_facilities:
                    db.query(PackageFacility).filter_by(package_id=compliance_package.package_id,
                                                        facility_id=facility.facility_id).delete()
                else:
                    facilities_ids.append(facility.facility_id)

            # Adding new facilities which are presented in the request, but not in the compliance_package
            for facility in current_request_facilities:
                if facility not in facilities_ids:
                    new_facility = PackageFacility()
                    new_facility.package_id = compliance_package.package_id
                    new_facility.facility_id = facility
                    db.add(new_facility)

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

            # Adding new facilities which are presented in the request, but not in the compliance_package
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
            return {
                "statusCode": 200,
                "body": json.dumps(compliance_package.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "CompliancePackage not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    package_id = event["pathParameters"]["package_id"]

    with DataBase.get_session(stage) as db:
        compliance_package = db.query(CompliancePackage).filter_by(package_id=package_id).first()
        if compliance_package:
            db.query(PackageDocument).filter_by(package_id=package_id).delete()
            db.query(PackageFacility).filter_by(package_id=package_id).delete()
            db.query(EmployeeCompliancePackage).filter_by(package_id=package_id).delete()
            db.delete(compliance_package)
            db.commit()  # Commit the deletion to the database
            return {
                "statusCode": 200,
                "body": json.dumps({"deleted_id": compliance_package.package_id})
            }
        else:
            return {"statusCode": 404, "body": "CompliancePackage not found"}
