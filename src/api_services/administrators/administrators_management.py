import json

from api_services.utils.database_utils import DataBase
from api_services.utils.wrappers_utils import set_stage
from data_models.model_administrator import Administrator


@set_stage
def get_all_handler(event, context, stage):
    with DataBase.get_session(stage) as db:
        try:
            administrators = db.query(Administrator).all()
            return {"statusCode": 200,
                    "headers": {
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
                    "body": json.dumps([admin.to_dict() for admin in administrators])}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving Administrators: {err}"}
