import json

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_administrator import Administrator


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    with DataBase.get_session(stage) as db:
        administrators = db.query(Administrator).all()
        return {
            "statusCode": 200,
            "body": json.dumps([admin.to_dict() for admin in administrators])
        }
