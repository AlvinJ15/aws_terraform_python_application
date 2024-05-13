import json

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_facilities import Facility
from data_models.models import update_object_from_dict


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]

    with DataBase.get_session(stage) as db:
        facilities = db.query(Facility).filter_by(organization_id=organization_id).order_by(Facility.name.asc()).all()
        return {
            "statusCode": 200,
            "body": json.dumps([facility.to_dict() for facility in facilities])
        }


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    facility_id = event["pathParameters"]["facility_id"]

    with DataBase.get_session(stage) as db:
        facility = db.query(Facility).filter_by(facility_id=facility_id).first()
        if facility:
            return {
                "statusCode": 200,
                "body": json.dumps(facility.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "Facility not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        new_facility = Facility(**data)
        new_facility.organization_id = organization_id
        new_facility.facility_id = DataBase.generate_uuid()
        db.add(new_facility)
        db.commit()
        return {
            "statusCode": 201,
            "body": json.dumps(new_facility.to_dict())
        }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    facility_id = event["pathParameters"]["facility_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        facility = db.query(Facility).filter_by(facility_id=facility_id, organization_id=organization_id).first()
        if facility:
            # facility_id isn't an updatable field
            if "facility_id" in data:
                data.pop("facility_id")
            updated_facility = update_object_from_dict(facility, data)
            db.commit()
            return {
                "statusCode": 200,
                "body": json.dumps(updated_facility.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "Facility not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    facility_id = event["pathParameters"]["facility_id"]

    with DataBase.get_session(stage) as db:
        facility = db.query(Facility).filter_by(facility_id=facility_id, organization_id=organization_id).first()
        if facility:
            db.delete(facility)
            db.commit()  # Commit the deletion to the database
            return {
                "statusCode": 200,
                "body": json.dumps({"deleted_id": facility.facility_id})
            }
        else:
            return {"statusCode": 404, "body": "Facility not found"}
