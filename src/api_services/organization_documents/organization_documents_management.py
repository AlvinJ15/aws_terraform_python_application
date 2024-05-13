import base64
import json

from streaming_form_data import StreamingFormDataParser
from streaming_form_data.targets import ValueTarget

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from api_services.utils.s3_utils import upload_file_to_s3
from data_models.model_organization_document import OrganizationDocument
from data_models.model_organization_document_facility import OrganizationDocumentFacility


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session(stage) as db:
        organization_documents = db.query(OrganizationDocument).filter_by(organization_id=organization_id)
        return {
            "statusCode": 200,
            "body": json.dumps([document.to_dict() for document in organization_documents])
        }


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session(stage) as db:
        organization_document = db.query(OrganizationDocument).filter_by(document_id=document_id).first()
        if organization_document:
            return {
                "statusCode": 200,
                "body": json.dumps(organization_document.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "OrganizationDocument not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]

    parser = StreamingFormDataParser(headers=event['headers'])
    # As the form has 2 fields: 1x Text & 1x File.
    # Here we initiate two ValueTarget to hold values in memory.
    title_target = ValueTarget()
    description_target = ValueTarget()
    purpose_target = ValueTarget()
    facilities_target = ValueTarget()
    file_target = ValueTarget()

    # Register function will link the multiplepart/from-data key name
    # with the value targets created above.
    parser.register("title", title_target)
    parser.register("description", description_target)
    parser.register("purpose", purpose_target)
    parser.register("facilities", facilities_target)
    parser.register("file", file_target)

    # decode event body passed by the API
    my_data = base64.b64decode(event["body"])
    parser.data_received(my_data)

    title = title_target.value.decode("utf-8")
    description = description_target.value.decode("utf-8")
    purpose = purpose_target.value.decode("utf-8")
    facilities = json.loads(facilities_target.value.decode("utf-8")) if facilities_target.value else []

    path = (f"{stage}/app_data/orgs/{organization_id}/org_documents/"
            f"{title}.{file_target.multipart_filename.split('.')[-1]}")
    s3_path = upload_file_to_s3(path, file_target.value, file_target.multipart_content_type)
    with DataBase.get_session(stage) as db:
        new_org_document = OrganizationDocument()
        new_org_document.document_id = DataBase.generate_uuid()
        new_org_document.organization_id = organization_id
        new_org_document.title = title
        new_org_document.description = description
        new_org_document.purpose = purpose
        new_org_document.s3_path = s3_path
        db.add(new_org_document)
        db.flush()

        for facility_id in facilities:
            new_org_doc_facility = OrganizationDocumentFacility()
            new_org_doc_facility.facility_id = facility_id
            new_org_doc_facility.document_id = new_org_document.document_id
            db.add(new_org_doc_facility)
        db.commit()
        new_org_document = db.query(OrganizationDocument).filter_by(
            document_id=new_org_document.document_id).first()
    return {
        'statusCode': 201,
        'body': json.dumps(new_org_document.to_dict())
    }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session(stage) as db:
        org_document = db.query(OrganizationDocument).filter_by(document_id=document_id).first()
        if not org_document:
            return {'statusCode': 404, 'body': "OrganizationDocument not found"}

        parser = StreamingFormDataParser(headers=event['headers'])
        # As the form has 2 fields: 1x Text & 1x File.
        # Here we initiate two ValueTarget to hold values in memory.
        title_target = ValueTarget()
        description_target = ValueTarget()
        purpose_target = ValueTarget()
        facilities_target = ValueTarget()
        file_target = ValueTarget()

        # Register function will link the multiplepart/from-data key name
        # with the value targets created above.
        parser.register("title", title_target)
        parser.register("description", description_target)
        parser.register("purpose", purpose_target)
        parser.register("facilities", facilities_target)
        parser.register("file", file_target)

        # decode event body passed by the API
        my_data = base64.b64decode(event["body"])
        parser.data_received(my_data)

        title = title_target.value.decode("utf-8")
        description = description_target.value.decode("utf-8")
        purpose = purpose_target.value.decode("utf-8")
        current_request_facilities = json.loads(facilities_target.value.decode("utf-8")) if facilities_target.value else []

        stage = event.get('requestContext', {}).get('stage')
        path = (f"{stage}/app_data/orgs/{organization_id}/org_documents/"
                f"{title}.{file_target.multipart_filename.split('.')[-1]}")
        org_document.title = title
        org_document.description = description
        org_document.purpose = purpose
        if file_target.value:
            org_document.s3_path = upload_file_to_s3(path, file_target.value, file_target.multipart_content_type)

        facilities_ids = []
        # Deleting the existing facilities for the current steps if the request doesn't have them
        for facility in org_document.facilities:
            if facility.facility_id not in current_request_facilities:
                db.query(OrganizationDocumentFacility).filter_by(
                    document_id=org_document.document_id, facility_id=facility.facility_id
                ).delete()
            else:
                facilities_ids.append(facility.facility_id)

        # Adding new facilities which are presented in the request, but not in the org_document
        for facility in current_request_facilities:
            if facility not in facilities_ids:
                new_facility = OrganizationDocumentFacility()
                new_facility.document_id = org_document.document_id
                new_facility.facility_id = facility
                db.add(new_facility)

        db.commit()
        db.refresh(org_document)
        return {
            'statusCode': 201,
            'body': json.dumps(org_document.to_dict())
        }


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session(stage) as db:
        organization_document = db.query(OrganizationDocument).filter_by(document_id=document_id).first()
        if organization_document:
            db.delete(organization_document)
            db.commit()  # Commit the deletion to the database
            return {"statusCode": 200, "body": json.dumps({"deleted_id": organization_document.document_id})}
        else:
            return {"statusCode": 404, "body": "OrganizationDocument not found"}
