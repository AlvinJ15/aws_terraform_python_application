import json

from api_services.utils.database_utils import DataBase
from api_services.utils.decorators_utils import add_cors_headers, handle_exceptions, set_stage
from data_models.model_onboarding import Onboarding
from data_models.model_onboarding_step import OnboardingStep
from data_models.model_step_facility import StepFacility
from data_models.models import update_object_from_dict


@add_cors_headers
@handle_exceptions
@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session(stage) as db:
        onboardings = db.query(Onboarding).filter_by(organization_id=organization_id)
        return {
            "statusCode": 200,
            "body": json.dumps([onboarding.to_dict() for onboarding in onboardings])
        }


@add_cors_headers
@handle_exceptions
@set_stage
def get_single_handler(event, context, stage):
    onboarding_id = event["pathParameters"]["onboarding_id"]

    with DataBase.get_session(stage) as db:
        onboarding = db.query(Onboarding).filter_by(onboarding_id=onboarding_id).first()
        if onboarding:
            return {
                "statusCode": 200,
                "body": json.dumps(onboarding.to_dict())
            }
        else:
            return {"statusCode": 404, "body": "Onboarding not found"}


@add_cors_headers
@handle_exceptions
@set_stage
def create_handler(event, context, stage):
    data = json.loads(event["body"])
    organization_id = event["pathParameters"]["organization_id"]

    with DataBase.get_session(stage) as db:
        # TODO: refactorize create and update to reuse code
        new_onboarding = Onboarding()
        new_onboarding.onboarding_id = DataBase.generate_uuid()
        new_onboarding.organization_id = organization_id
        new_onboarding.created = DataBase.get_now()
        db.add(new_onboarding)
        db.flush()
        steps = data.get("steps", [])
        for step in steps:
            facilities = step.get('facilities', [])
            if facilities:
                step.pop('facilities')
            new_step = OnboardingStep(**step)
            new_step.step_id = DataBase.generate_uuid()
            new_step.organization_id = organization_id
            new_step.onboarding_id = new_onboarding.onboarding_id
            db.add(new_step)
            db.flush()
            for facility_id in facilities:
                new_step_facility = StepFacility()
                new_step_facility.step_id = new_step.step_id
                new_step_facility.facility_id = facility_id
                db.add(new_step_facility)
        db.commit()
        new_onboarding = db.query(Onboarding).filter_by(onboarding_id=new_onboarding.onboarding_id).first()
        return {
            "statusCode": 201,
            "body": json.dumps(new_onboarding.to_dict())
        }


@add_cors_headers
@handle_exceptions
@set_stage
def update_handler(event, context, stage):
    onboarding_id = event["pathParameters"]["onboarding_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        onboarding = db.query(Onboarding).filter_by(
            onboarding_id=onboarding_id, organization_id=organization_id
        ).first()
        if not onboarding:
            return {"statusCode": 404, "body": "Onboarding not found"}

        onboarding.last_modified = DataBase.get_now()
        existing_steps = onboarding.steps
        request_steps = data.get('steps', [])
        request_steps_ids = [step.get('step_id') for step in request_steps]
        existing_steps_ids = [step.step_id for step in existing_steps]
        for request_step in request_steps:
            if request_step.get('step_id') not in existing_steps_ids:
                facilities = request_step.get('facilities', [])
                if facilities:
                    request_step.pop('facilities')
                new_step = OnboardingStep(**request_step)
                new_step.step_id = DataBase.generate_uuid()
                new_step.organization_id = organization_id
                new_step.onboarding_id = onboarding_id
                db.add(new_step)
                db.flush()
                for facility_id in facilities:
                    new_step_facility = StepFacility()
                    new_step_facility.step_id = new_step.step_id
                    new_step_facility.facility_id = facility_id
                    db.add(new_step_facility)

        for step in existing_steps:
            # deleting steps which exists in the onboarding, but they aren't present in the request
            if step.step_id not in request_steps_ids:
                for facility in step.facilities:
                    db.query(StepFacility).filter_by(step_id=step.step_id, facility_id=facility.facility_id).delete()
                db.delete(step)
            # updating the existing steps
            else:
                current_request_step = request_steps[request_steps_ids.index(step.step_id)]
                current_request_step_facilities = current_request_step.get('facilities', [])
                step_facilities_ids = []
                if 'facilities' in current_request_step:
                    current_request_step.pop('facilities')

                # Deleting the existing facilities for the current steps if the request doesn't have them
                for facility in step.facilities:
                    if facility.facility_id not in current_request_step_facilities:
                        db.query(StepFacility).filter_by(step_id=step.step_id, facility_id=facility.facility_id).delete()
                    else:
                        step_facilities_ids.append(facility.facility_id)

                # Adding new facilities which are presented in the request, but not in the step
                for facility in current_request_step_facilities:
                    if facility not in step_facilities_ids:
                        new_step_facility = StepFacility()
                        new_step_facility.step_id = step.step_id
                        new_step_facility.facility_id = facility
                        db.add(new_step_facility)
                update_object_from_dict(step, current_request_step)

        db.commit()
        onboarding = db.query(Onboarding).filter_by(
            onboarding_id=onboarding_id, organization_id=organization_id
        ).first()
        return {
            "statusCode": 200,
            "body": json.dumps(onboarding.to_dict())
        }


@add_cors_headers
@handle_exceptions
@set_stage
def delete_single_handler(event, context, stage):
    onboarding_id = event["pathParameters"]["onboarding_id"]

    with DataBase.get_session(stage) as db:
        onboarding = db.query(Onboarding).filter_by(onboarding_id=onboarding_id).first()
        if onboarding:
            db.delete(onboarding)
            db.commit()  # Commit the deletion to the database
            return {
                "statusCode": 200,
                "body": json.dumps({"deleted_id": onboarding.onboarding_id})
            }
        else:
            return {"statusCode": 404, "body": "Onboarding not found"}
