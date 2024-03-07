import json

from api_services.utils.database_utils import DataBase
from api_services.utils.wrappers_utils import set_stage
from data_models.model_questionnaire import Questionnaire
from data_models.models import update_object_from_dict


@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session(stage) as db:
        try:
            questionnaires = db.query(Questionnaire).filter_by(organization_id=organization_id)
            return {"statusCode": 200,
                    "body": json.dumps([questionnaire.to_dict() for questionnaire in questionnaires])}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving Questionnaire: {err}"}


@set_stage
def get_single_handler(event, context, stage):
    questionnaire_id = event["pathParameters"]["questionnaire_id"]

    with DataBase.get_session(stage) as db:
        try:
            questionnaire = db.query(Questionnaire).filter_by(questionnaire_id=questionnaire_id).first()
            if questionnaire:
                return {"statusCode": 200, "body": json.dumps(questionnaire.to_dict())}
            else:
                return {"statusCode": 404, "body": "Questionnaire not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving Questionnaire: {err}"}


@set_stage
def create_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        try:
            new_questionnaire = Questionnaire(**data)
            new_questionnaire.organization_id = organization_id
            new_questionnaire.questionnaire_id = DataBase.generate_uuid()
            db.add(new_questionnaire)
            db.commit()
            return {"statusCode": 201, "body": json.dumps(new_questionnaire.to_dict())}
        except Exception as err:  # Handle general exceptions for robustness
            return {"statusCode": 500, "body": f"Error creating Questionnaire: {err}"}


@set_stage
def update_handler(event, context, stage):
    questionnaire_id = event["pathParameters"]["questionnaire_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        try:
            questionnaire = db.query(Questionnaire).filter_by(
                questionnaire_id=questionnaire_id, organization_id=organization_id
            ).first()
            if questionnaire:
                # questionnaire_id is not an updatable attribute
                if "questionnaire_id" in data:
                    data.pop("questionnaire_id")
                updated_questionnaire = update_object_from_dict(questionnaire, data)
                db.commit()
                return {"statusCode": 200, "body": json.dumps(updated_questionnaire.to_dict())}
            else:
                return {"statusCode": 404, "body": "Questionnaire not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error updating Questionnaire: {err}"}


@set_stage
def delete_single_handler(event, context, stage):
    questionnaire_id = event["pathParameters"]["questionnaire_id"]

    with DataBase.get_session(stage) as db:
        try:
            questionnaire = db.query(Questionnaire).filter_by(questionnaire_id=questionnaire_id).first()
            if questionnaire:
                db.delete(questionnaire)
                db.commit()  # Commit the deletion to the database
                return {"statusCode": 200, "body": json.dumps({"deleted_id": questionnaire.questionnaire_id})}
            else:
                return {"statusCode": 404, "body": "Questionnaire not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error deleting Questionnaire: {err}"}
