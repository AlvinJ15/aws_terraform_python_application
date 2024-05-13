import json

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_employee_questionnaire_response import EmployeeQuestionnaireResponse
from data_models.model_questionnaire import Questionnaire
from data_models.models import update_object_from_dict


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    employee_id = event["pathParameters"]["employee_id"]
    with DataBase.get_session(stage) as db:
        questionnaires = db.query(EmployeeQuestionnaireResponse).filter_by(
            employee_id=employee_id
        )
        return {
            "statusCode": 200,
            "body": json.dumps([questionnaire.to_dict() for questionnaire in questionnaires])
        }


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    response_id = event["pathParameters"]["response_id"]

    with DataBase.get_session(stage) as db:
        questionnaire = db.query(EmployeeQuestionnaireResponse).filter_by(response_id=response_id).first()
        if questionnaire:
            return {"statusCode": 200, "body": json.dumps(questionnaire.to_dict())}
        else:
            return {"statusCode": 404, "body": "EmployeeQuestionnaireResponse not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    employee_id = event["pathParameters"]["employee_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        new_response = EmployeeQuestionnaireResponse(**data)
        new_response.employee_id = employee_id
        new_response.response_id = DataBase.generate_uuid()
        if new_response.status == 'Completed':
            new_response.completed = DataBase.get_now()
        else:
            new_response.completed = None
        db.add(new_response)
        db.commit()
        return {
            "statusCode": 201,
            "body": json.dumps(new_response.to_dict())
        }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    response_id = event["pathParameters"]["response_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        response = db.query(EmployeeQuestionnaireResponse).filter_by(
            response_id=response_id
        ).first()
        if response:
            # response_id is not an updatable attribute
            if "response_id" in data:
                data.pop("response_id")
            update_object_from_dict(response, data)
            if response.status == 'Completed':
                response.completed = DataBase.get_now()
            else:
                response.completed = None
            db.commit()
            return {
                "statusCode": 200,
                "body": json.dumps(response.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "EmployeeQuestionnaireResponse not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    response_id = event["pathParameters"]["response_id"]

    with DataBase.get_session(stage) as db:
        response = db.query(EmployeeQuestionnaireResponse).filter_by(response_id=response_id).first()
        if response:
            db.delete(response)
            db.commit()  # Commit the deletion to the database
            return {
                "statusCode": 200,
                "body": json.dumps({"deleted_id": response.response_id})
            }
        else:
            return {"statusCode": 404, "body": "EmployeeQuestionnaireResponse not found"}
