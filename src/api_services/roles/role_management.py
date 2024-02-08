import boto3
import json

from api_services.database_utils import get_session
from data_models.model_roles import Role
from data_models.models import update_object_from_dict


def get_all_handler(event, context):
    organization_id = event["pathParameters"]["organization_id"]
    with get_session() as db:
        try:
            roles = db.query(Role).filter_by(organization_id=organization_id)
            return {"statusCode": 200, "body": json.dumps([role.to_dict() for role in roles])}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving roles: {err}"}


def get_single_handler(event, context):
    role_id = event["pathParameters"]["role_id"]

    with get_session() as db:
        try:
            role = db.query(Role).filter_by(role_id=role_id).first()
            if role:
                return {"statusCode": 200, "body": json.dumps(role.to_dict())}
            else:
                return {"statusCode": 404, "body": "Role not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving role: {err}"}


def create_handler(event, context):
    # Retrieve role data from event payload
    data = json.loads(event["body"])

    with get_session() as db:
        try:
            new_role = Role(**data)
            db.add(new_role)
            db.commit()
            return {"statusCode": 201, "body": json.dumps({"role_id": new_role.role_id})}
        except Exception as err:  # Handle general exceptions for robustness
            return {"statusCode": 500, "body": f"Error creating role: {err}"}


def update_handler(event, context):
    role_id = event["pathParameters"]["role_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with get_session() as db:
        try:
            role = db.query(Role).filter_by(role_id=role_id, organization_id=organization_id).first()
            if role:
                update_object_from_dict(role, data)
                # role.__dict__.update(**data)
                db.commit()
                return {"statusCode": 200, "body": "Role updated successfully"}
            else:
                return {"statusCode": 404, "body": "Role not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error updating role: {err}"}
