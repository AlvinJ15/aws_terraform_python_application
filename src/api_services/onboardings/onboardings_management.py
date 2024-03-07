import json

from api_services.utils.database_utils import DataBase
from api_services.utils.wrappers_utils import set_stage
from data_models.model_onboarding import Onboarding
from data_models.model_onboarding_step import OnboardingStep
from data_models.model_step_role import StepRole
from data_models.models import update_object_from_dict


@set_stage
def get_all_handler(event, context, stage):
    organization_id = event["pathParameters"]["organization_id"]
    with DataBase.get_session(stage) as db:
        try:
            onboardings = db.query(Onboarding).filter_by(organization_id=organization_id)
            return {"statusCode": 200, "body": json.dumps([onboarding.to_dict() for onboarding in onboardings])}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving Onboarding: {err}"}


@set_stage
def get_single_handler(event, context, stage):
    onboarding_id = event["pathParameters"]["onboarding_id"]

    with DataBase.get_session(stage) as db:
        try:
            onboarding = db.query(Onboarding).filter_by(onboarding_id=onboarding_id).first()
            if onboarding:
                return {"statusCode": 200, "body": json.dumps(onboarding.to_dict())}
            else:
                return {"statusCode": 404, "body": "Onboarding not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error retrieving Onboarding: {err}"}


@set_stage
def create_handler(event, context, stage):
    data = json.loads(event["body"])
    organization_id = event["pathParameters"]["organization_id"]

    with DataBase.get_session(stage) as db:
        try:
            # TODO: refactorize create and update to reuse code
            new_onboarding = Onboarding()
            new_onboarding.onboarding_id = DataBase.generate_uuid()
            new_onboarding.organization_id = organization_id
            new_onboarding.created = DataBase.get_now()
            db.add(new_onboarding)
            db.flush()
            steps = data.get("steps", [])
            for step in steps:
                roles = step.get('roles', [])
                if roles:
                    step.pop('roles')
                new_step = OnboardingStep(**step)
                new_step.step_id = DataBase.generate_uuid()
                new_step.organization_id = organization_id
                new_step.onboarding_id = new_onboarding.onboarding_id
                db.add(new_step)
                db.flush()
                for role_id in roles:
                    new_step_role = StepRole()
                    new_step_role.step_id = new_step.step_id
                    new_step_role.role_id = role_id
                    db.add(new_step_role)
            db.commit()
            new_onboarding = db.query(Onboarding).filter_by(onboarding_id=new_onboarding.onboarding_id).first()
            return {"statusCode": 201, "body": json.dumps(new_onboarding.to_dict())}
        except Exception as err:  # Handle general exceptions for robustness
            return {"statusCode": 500, "body": f"Error creating Onboarding: {err}"}


@set_stage
def update_handler(event, context, stage):
    onboarding_id = event["pathParameters"]["onboarding_id"]
    organization_id = event["pathParameters"]["organization_id"]
    data = json.loads(event["body"])

    with DataBase.get_session(stage) as db:
        try:
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
                    roles = request_step.get('roles', [])
                    if roles:
                        request_step.pop('roles')
                    new_step = OnboardingStep(**request_step)
                    new_step.step_id = DataBase.generate_uuid()
                    new_step.organization_id = organization_id
                    new_step.onboarding_id = onboarding_id
                    db.add(new_step)
                    db.flush()
                    for role_id in roles:
                        new_step_role = StepRole()
                        new_step_role.step_id = new_step.step_id
                        new_step_role.role_id = role_id
                        db.add(new_step_role)

            for step in existing_steps:
                # deleting steps which exists in the onboarding, but they aren't present in the request
                if step.step_id not in request_steps_ids:
                    for role in step.roles:
                        db.query(StepRole).filter_by(step_id=step.step_id, role_id=role.role_id).delete()
                    db.delete(step)
                # updating the existing steps
                else:
                    current_request_step = request_steps[request_steps_ids.index(step.step_id)]
                    current_request_step_roles = current_request_step.get('roles', [])
                    step_roles_ids = []
                    if 'roles' in current_request_step:
                        current_request_step.pop('roles')

                    # Deleting the existing roles for the current steps if the request doesn't have them
                    for role in step.roles:
                        if role.role_id not in current_request_step_roles:
                            db.query(StepRole).filter_by(step_id=step.step_id, role_id=role.role_id).delete()
                        else:
                            step_roles_ids.append(role.role_id)

                    # Adding new roles which are presented in the request, but not in the step
                    for role in current_request_step_roles:
                        if role not in step_roles_ids:
                            new_step_role = StepRole()
                            new_step_role.step_id = step.step_id
                            new_step_role.role_id = role
                            db.add(new_step_role)
                    update_object_from_dict(step, current_request_step)

            db.commit()
            onboarding = db.query(Onboarding).filter_by(
                onboarding_id=onboarding_id, organization_id=organization_id
            ).first()
            return {"statusCode": 200, "body": json.dumps(onboarding.to_dict())}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error updating Onboarding: {err}"}


@set_stage
def delete_single_handler(event, context, stage):
    onboarding_id = event["pathParameters"]["onboarding_id"]

    with DataBase.get_session(stage) as db:
        try:
            onboarding = db.query(Onboarding).filter_by(onboarding_id=onboarding_id).first()
            if onboarding:
                db.delete(onboarding)
                db.commit()  # Commit the deletion to the database
                return {"statusCode": 200, "body": json.dumps({"deleted_id": onboarding.onboarding_id})}
            else:
                return {"statusCode": 404, "body": "Onboarding not found"}
        except Exception as err:
            return {"statusCode": 500, "body": f"Error deleting Onboarding: {err}"}
