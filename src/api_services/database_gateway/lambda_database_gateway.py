import json

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage

from data_models.model_administrator import Administrator


@handle_exceptions
@set_stage
def query_handler(event, context, stage):
    query = event['query_code']
    with DataBase.get_session(stage) as db:
        result = eval(query)
        return {
            'body': json.dumps([admin.to_dict() for admin in result])
        }
