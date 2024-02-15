import json

from streaming_form_data import StreamingFormDataParser
from streaming_form_data.targets import ValueTarget

from api_services.utils.database_utils import DataBase
from api_services.utils.s3_utils import upload_file_to_s3
from data_models.model_organization_document import OrganizationDocument
from data_models.model_organization_document_role import OrganizationDocumentRole


def get_all_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session() as db:
        try:
            organization_documents = db.query(OrganizationDocument).filter_by(organization_id=organization_id)
            return {"statusCode": 200, "body": json.dumps([document.to_dict() for document in organization_documents])}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving OrganizationDocument: {err}"}


def get_single_handler(event, context):
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session() as db:
        try:
            organization_document = db.query(OrganizationDocument).filter_by(document_id=document_id).first()
            if organization_document:
                return {"statusCode": 200, "body": json.dumps(organization_document.to_dict())}
            else:
                return {"statusCode": 404, "body": "OrganizationDocument not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving OrganizationDocument: {err}"}


def create_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]

    parser = StreamingFormDataParser(headers=event['headers'])
    # As the form has 2 fields: 1x Text & 1x File.
    # Here we initiate two ValueTarget to hold values in memory.
    title_target = ValueTarget()
    description_target = ValueTarget()
    purpose_target = ValueTarget()
    roles_target = ValueTarget()
    file_target = ValueTarget()

    # Register function will link the multiplepart/from-data key name
    # with the value targets created above.
    parser.register("title", title_target)
    parser.register("description", description_target)
    parser.register("purpose", purpose_target)
    parser.register("roles", roles_target)
    parser.register("file", file_target)

    # decode event body passed by the API
    my_data = event["body"].encode()
    parser.data_received(my_data)

    title = title_target.value.decode("utf-8")
    description = description_target.value.decode("utf-8")
    purpose = purpose_target.value.decode("utf-8")
    roles = json.loads(roles_target.value.decode("utf-8")) if roles_target.value else []

    stage = event.get('requestContext', {}).get('stage')
    path = f"{stage}/app_data/orgs/{organization_id}/org_documents/{title}"
    bucket_name = "tollacred"
    try:
        s3_path = upload_file_to_s3(bucket_name, path, file_target.value)
        with DataBase.get_session() as db:
            new_org_document = OrganizationDocument()
            new_org_document.document_id = DataBase.generate_uuid()
            new_org_document.organization_id = organization_id
            new_org_document.title = title
            new_org_document.description = description
            new_org_document.purpose = purpose
            new_org_document.s3_path = s3_path
            db.add(new_org_document)
            db.flush()

            for role_id in roles:
                new_org_doc_role = OrganizationDocumentRole()
                new_org_doc_role.role_id = role_id
                new_org_doc_role.document_id = new_org_document.document_id
                db.add(new_org_doc_role)
            db.commit()
            new_org_document = db.query(OrganizationDocument).filter_by(
                document_id=new_org_document.document_id).first()
        return {
            'statusCode': 201,
            'body': json.dumps(new_org_document.to_dict())
        }
    except Exception as err:  # Handle general exceptions for robustness
        return {"statusCode": 500, "body": f"Error creating OrganizationDocument: {err}"}


def update_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session() as db:
        org_document = db.query(OrganizationDocument).filter_by(document_id=document_id).first()
        if not org_document:
            return {'statusCode': 404, 'body': "OrganizationDocument not found"}

        parser = StreamingFormDataParser(headers=event['headers'])
        # As the form has 2 fields: 1x Text & 1x File.
        # Here we initiate two ValueTarget to hold values in memory.
        title_target = ValueTarget()
        description_target = ValueTarget()
        purpose_target = ValueTarget()
        roles_target = ValueTarget()
        file_target = ValueTarget()

        # Register function will link the multiplepart/from-data key name
        # with the value targets created above.
        parser.register("title", title_target)
        parser.register("description", description_target)
        parser.register("purpose", purpose_target)
        parser.register("roles", roles_target)
        parser.register("file", file_target)

        # decode event body passed by the API
        my_data = event["body"].encode()
        parser.data_received(my_data)

        title = title_target.value.decode("utf-8")
        description = description_target.value.decode("utf-8")
        purpose = purpose_target.value.decode("utf-8")
        current_request_roles = json.loads(roles_target.value.decode("utf-8")) if roles_target.value else []

        stage = event.get('requestContext', {}).get('stage')
        path = f"{stage}/app_data/orgs/{organization_id}/org_documents/{title}"
        bucket_name = "tollacred"
        try:
            with DataBase.get_session() as db:
                org_document.title = title
                org_document.description = description
                org_document.purpose = purpose
                if file_target.value:
                    org_document.s3_path = upload_file_to_s3(bucket_name, path, file_target.value)

                roles_ids = []
                # Deleting the existing roles for the current steps if the request doesn't have them
                for role in org_document.roles:
                    if role.role_id not in current_request_roles:
                        db.query(OrganizationDocumentRole).filter_by(
                            document_id=org_document.document_id, role_id=role.role_id
                        ).delete()
                    else:
                        roles_ids.append(role.role_id)

                # Adding new roles which are presented in the request, but not in the org_document
                for role in current_request_roles:
                    if role not in roles_ids:
                        new_role = OrganizationDocumentRole()
                        new_role.document_id = org_document.document_id
                        new_role.role_id = role
                        db.add(new_role)

                db.commit()
                db.refresh(org_document)
            return {
                'statusCode': 201,
                'body': json.dumps(org_document.to_dict())
            }
        except Exception as err:  # Handle general exceptions for robustness
            return {"statusCode": 500, "body": f"Error creating OrganizationDocument: {err}"}


def delete_single_handler(event, context):
    document_id = event["pathParameters"]["document_id"]

    with DataBase.get_session() as db:
        try:
            organization_document = db.query(OrganizationDocument).filter_by(document_id=document_id).first()
            if organization_document:
                db.delete(organization_document)
                db.commit()  # Commit the deletion to the database
                return {"statusCode": 200, "body": json.dumps({"deleted_id": organization_document.document_id})}
            else:
                return {"statusCode": 404, "body": "OrganizationDocument not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error deleting OrganizationDocument: {err}"}
