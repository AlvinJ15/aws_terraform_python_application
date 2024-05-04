import json

from api_services.utils.database_utils import DataBase
from api_services.utils.error_utils import print_exception_stack
from api_services.utils.wrappers_utils import set_stage
from data_models.model_roles import Role
from data_models.models import update_object_from_dict


@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]

    with DataBase.get_session(stage) as db:
        try:
            roles = db.query(Role).filter_by(organization_id=organization_id).order_by(Role.name.asc()).all()
            return {"statusCode": 200,
                    "headers": {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    "body": json.dumps([role.to_dict() for role in roles])}
        except Exception as err:
            print_exception_stack()
            return {"statusCode": 500, "body": f"Error retrieving roles: {err}"}


@set_stage
def get_single_handler(event, context, stage):
    role_id = event["pathParameters"]["role_id"]

    with DataBase.get_session(stage) as db:
        try:
            role = db.query(Role).filter_by(role_id=role_id).first()
            if role:
                return {"statusCode": 200,
                        "headers": {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                        },
                        "body": json.dumps(role.to_dict())}
            else:
                return {"statusCode": 404, "body": "Role not found"}
        except Exception as err:
            print_exception_stack()
            return {"statusCode": 500, "body": f"Error retrieving role: {err}"}


@set_stage
def create_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        try:
            new_role = Role(**data)
            new_role.organization_id = organization_id
            new_role.role_id = DataBase.generate_uuid()
            db.add(new_role)
            db.commit()
            return {"statusCode": 201,
                    "headers": {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    "body": json.dumps(new_role.to_dict())}
        except Exception as err:  # Handle general exceptions for robustness
            print_exception_stack()
            return {"statusCode": 500, "body": f"Error creating role: {err}"}


@set_stage
def update_handler(event, context, stage):
    role_id = event["pathParameters"]["role_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        try:
            role = db.query(Role).filter_by(role_id=role_id, organization_id=organization_id).first()
            if role:
                # role_id isn't an updatable field
                if "role_id" in data:
                    data.pop("role_id")
                updated_role = update_object_from_dict(role, data)
                db.commit()
                return {"statusCode": 200,
                        "headers": {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE,PUT'
                        },
                        "body": json.dumps(updated_role.to_dict())}
            else:
                return {"statusCode": 404, "body": "Role not found"}
        except Exception as err:
            print_exception_stack()
            return {"statusCode": 500, "body": f"Error updating role: {err}"}


@set_stage
def delete_single_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    role_id = event["pathParameters"]["role_id"]

    with DataBase.get_session(stage) as db:
        try:
            role = db.query(Role).filter_by(role_id=role_id, organization_id=organization_id).first()
            if role:
                db.delete(role)
                db.commit()  # Commit the deletion to the database
                return {"statusCode": 200,
                        "headers": {
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE,PUT'
                        },
                        "body": json.dumps({"deleted_id": role.role_id})}
            else:
                return {"statusCode": 404, "body": "Role not found"}
        except Exception as err:
            print_exception_stack()
            return {"statusCode": 500, "body": f"Error deleting Role: {err}"}
