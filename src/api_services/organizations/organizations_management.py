import json

from api_services.utils.database_utils import DataBase
from api_services.utils.error_utils import print_exception_stack
from api_services.utils.wrappers_utils import set_stage
from data_models.model_organization import Organization


@set_stage
def get_single_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]

    with DataBase.get_session(stage) as db:
        try:
            organization = db.query(Organization).filter_by(id=organization_id).first()
            if organization:
                return {
                    "statusCode": 200,
                    "headers": {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    "body": json.dumps(organization.to_dict())
                }
            else:
                return {"statusCode": 404, "body": "Organization not found"}
        except Exception as err:
            print_exception_stack()
            return {"statusCode": 500, "body": f"Error retrieving Organization: {err}"}
