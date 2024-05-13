import json


from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_organization import Organization


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]

    with DataBase.get_session(stage) as db:
        organization = db.query(Organization).filter_by(id=organization_id).first()
        if organization:
            return {
                "statusCode": 200,
                "body": json.dumps(organization.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "Organization not found"}