import json

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_document_type import DocumentType
from data_models.models import update_object_from_dict


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session(stage) as db:
        document_types = db.query(DocumentType).filter_by(organization_id=organization_id)
        return {
            "statusCode": 200,
            "body": json.dumps([document_type.to_dict() for document_type in document_types])
        }


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    document_type_id = event["pathParameters"]["document_id"]

    with DataBase.get_session(stage) as db:
        document_type = db.query(DocumentType).filter_by(id=document_type_id).first()
        if document_type:
            return {
                "statusCode": 200,
                "body": json.dumps(document_type.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "DocumentType not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        new_document_type = DocumentType(**data)
        new_document_type.organization_id = organization_id
        new_document_type.id = DataBase.generate_uuid()
        db.add(new_document_type)
        db.commit()
        return {
            "statusCode": 201,
            "body": json.dumps(new_document_type.to_dict())
        }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    document_type_id = event["pathParameters"]["document_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        document_type = db.query(DocumentType).filter_by(
            id=document_type_id, organization_id=organization_id
        ).first()
        if document_type:
            # id is not an updatable attribute
            if "id" in data:
                data.pop("id")
            updated_document_type = update_object_from_dict(document_type, data)
            db.commit()
            return {
                "statusCode": 200,
                "body": json.dumps(updated_document_type.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "DocumentType not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    document_type_id = event["pathParameters"]["document_id"]

    with DataBase.get_session(stage) as db:
        document_type = db.query(DocumentType).filter_by(id=document_type_id).first()
        if document_type:
            db.delete(document_type)
            db.commit()  # Commit the deletion to the database
            return {
                "statusCode": 200,
                "body": json.dumps({"deleted_id": document_type.id})
            }
        else:
            return {"statusCode": 404, "body": "DocumentType not found"}
