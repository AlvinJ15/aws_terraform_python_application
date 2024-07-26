import json

from api_services.database_gateway.DataBaseGateway import DataBaseGateway
from api_services.employees.employees_utils import get_employees_with_filter
from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_administrator import Administrator


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage: str):
    db = DataBaseGateway()
    event_data = {
        'query_code': db.query(Administrator).all().generate(),
    }
    # Lambda.invoke_lambda(, event_data)
    import boto3
    client = boto3.client('lambda')

    database_response = client.invoke(
        FunctionName=f'Org-DatabaseGateway-{stage.title()}',
        InvocationType='RequestResponse',
        Payload=json.dumps(event_data)
    )
    data = json.loads(database_response['Payload'].read())

    return {
        "statusCode": 200,
        "body": data['body']
    }


@add_cors_headers
@handle_exceptions
@set_stage
def get_logged_user_id(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    email = event['requestContext']['authorizer']['claims']['email']
    event['queryStringParameters'] = {'email': email}
    with DataBase.get_session(stage) as db:
        query = get_employees_with_filter(db, organization_id, event['queryStringParameters'])
        employee = query.first()
        return {
            "statusCode": 200,
            "body": json.dumps(employee.to_dict())
        }
