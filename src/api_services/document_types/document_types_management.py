import json

from api_services.utils.database_utils import DataBase
from data_models.model_document_type import DocumentType
from data_models.models import update_object_from_dict


def get_all_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session() as db:
        try:
            document_types = db.query(DocumentType).filter_by(organization_id=organization_id)
            return {"statusCode": 200,
                    "headers": {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, PUT'
                    },
                    "body": json.dumps([document_type.to_dict() for document_type in document_types])}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving DocumentType: {err}"}


def get_single_handler(event, context):
    document_type_id = event["pathParameters"]["document_id"]

    with DataBase.get_session() as db:
        try:
            document_type = db.query(DocumentType).filter_by(id=document_type_id).first()
            if document_type:
                return {"statusCode": 200,
                        "headers": {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, PUT'
                        },
                        "body": json.dumps(document_type.to_dict())}
            else:
                return {"statusCode": 404, "body": "DocumentType not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving DocumentType: {err}"}


def create_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session() as db:
        try:
            new_document_type = DocumentType(**data)
            new_document_type.organization_id = organization_id
            new_document_type.id = DataBase.generate_uuid()
            db.add(new_document_type)
            db.commit()
            return {"statusCode": 201,
                    "headers": {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, PUT'
                    },
                    "body": json.dumps(new_document_type.to_dict())}
        except Exception as err:  # Handle general exceptions for robustness
            return {"statusCode": 500, "body": f"Error creating DocumentType: {err}"}


def update_handler(event, context):
    document_type_id = event["pathParameters"]["document_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session() as db:
        try:
            document_type = db.query(DocumentType).filter_by(
                id=document_type_id, organization_id=organization_id
            ).first()
            if document_type:
                # id is not an updatable attribute
                if "id" in data:
                    data.pop("id")
                updated_document_type = update_object_from_dict(document_type, data)
                db.commit()
                return {"statusCode": 200,
                        "headers": {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, PUT'
                        },
                        "body": json.dumps(updated_document_type.to_dict())}
            else:
                return {"statusCode": 404, "body": "DocumentType not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error updating DocumentType: {err}"}


def delete_single_handler(event, context):
    document_type_id = event["pathParameters"]["document_id"]

    with DataBase.get_session() as db:
        try:
            document_type = db.query(DocumentType).filter_by(id=document_type_id).first()
            if document_type:
                db.delete(document_type)
                db.commit()  # Commit the deletion to the database
                return {"statusCode": 200,
                        "headers": {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, PUT'
                        },
                        "body": json.dumps({"deleted_id": document_type.id})}
            else:
                return {"statusCode": 404, "body": "DocumentType not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error deleting DocumentType: {err}"}
