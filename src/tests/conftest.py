import json
from unittest.mock import patch

import pytest

from api_services.utils.database_utils import DataBase
from tests.mocks.mock_database_utils import MockDatabase, mock_get_collation_ids, mock_get_tinyint_class


@pytest.fixture(scope="session")
@patch("data_models.models.get_collation_ids", mock_get_collation_ids)
@patch("data_models.models.get_tinyint_class", mock_get_tinyint_class)
@patch("api_services.utils.database_utils.DataBase.create_session", MockDatabase.mock_create_session)
@patch("api_services.utils.database_utils.DataBase.generate_uuid", MockDatabase.mock_generate_uuid)
@patch("api_services.utils.database_utils.DataBase.get_now", MockDatabase.mock_now)
def initialize_db():
    """
    This fixture initializes fake database for all tests.
    """
    from data_models.model_document_type import DocumentType
    from data_models.model_onboarding import Onboarding
    from data_models.model_onboarding_step import OnboardingStep
    from data_models.model_organization import Organization
    from data_models.model_questionnaire import Questionnaire
    from data_models.model_roles import Role
    from data_models.model_step_role import StepRole

    table_insert_data(Role)
    table_insert_data(Organization)
    table_insert_data(DocumentType)
    table_insert_data(Onboarding)
    table_insert_data(OnboardingStep)
    table_insert_data(StepRole)
    table_insert_data(Questionnaire)


def table_insert_data(BaseModelClass):
    table_name = BaseModelClass.__tablename__
    records = json.load(open(f"tests/json_data/tables_data/table_{table_name}.json"))
    with DataBase.get_session() as db:
        try:
            for record in records:
                db.add(BaseModelClass(**record))
            db.commit()
        except Exception as err:
            print(f"ERROR: {err}")