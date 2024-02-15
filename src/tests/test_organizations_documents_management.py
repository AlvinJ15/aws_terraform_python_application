import json
from unittest.mock import patch

from requests_toolbelt import MultipartEncoder

from tests.mocks.mock_database_utils import MockDatabase, \
    mock_get_collation_ids, mock_get_tinyint_class
from tests.test_utils import get_file_content

BASE_JSON_FOLDER = "tests/json_data"
EXPECTED_JSON_PATH = f'{BASE_JSON_FOLDER}/expected/onboardings_management'
BODY_JSON_FOLDER = f'{BASE_JSON_FOLDER}/body_request/onboardings_management'


@patch("data_models.models.get_collation_ids", mock_get_collation_ids)
@patch("data_models.models.get_tinyint_class", mock_get_tinyint_class)
@patch("api_services.utils.database_utils.DataBase.generate_uuid", MockDatabase.mock_generate_uuid)
@patch("api_services.utils.database_utils.DataBase.get_now", MockDatabase.mock_now)
class TestOnboardings:
    def setup_method(self, method):
        from api_services.organization_documents.organization_documents_management import (
            get_all_handler, get_single_handler, create_handler, update_handler, delete_single_handler
        )
        self.get_all_handler = get_all_handler
        self.get_single_handler = get_single_handler
        self.create_handler = create_handler
        self.update_handler = update_handler
        self.delete_single_handler = delete_single_handler

    def test_get_all_handler(self, initialize_db):
        event = {"pathParameters": {"organization_id": "11111111-1111-1111-1111-111111111111"}}
        response = self.get_all_handler(event, {})

        assert response["statusCode"] == 200
        expected = json.load(
            open(f"{EXPECTED_JSON_PATH}/expected_get_all_handler.json")
        )
        assert json.loads(response["body"]) == expected

    def test_single_all_handler(self, initialize_db):
        event = {
            "pathParameters": {
                "organization_id": "11111111-1111-1111-1111-111111111111",
                "onboarding_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
            }
        }
        response = self.get_single_handler(event, {})

        assert response["statusCode"] == 200
        expected = json.load(
            open(f"{EXPECTED_JSON_PATH}/expected_get_single_handler.json")
        )
        assert json.loads(response["body"]) == expected

    def test_create_handler(self, initialize_db):
        MockDatabase.COUNT_UUID = 0
        m = MultipartEncoder(
            fields={
                'name': 'test_name',
                'description': 'test_description',
                'document_file': (
                'body_create_handler.json', open(f"{BODY_JSON_FOLDER}/body_create_handler.json", 'rb'),
                'application/pdf')
            }
        )
        event = {
            "pathParameters": {
                "organization_id": "11111111-1111-1111-1111-111111111111"
            },
            'multiValueHeaders': {
                key: value for key, value in m.fields.items()
            },
            'body': m.to_string()
        }
        response = self.create_handler(event, {})

        assert response["statusCode"] == 201
        expected = json.load(
            open(f"{EXPECTED_JSON_PATH}/expected_create_handler.json")
        )
        assert json.loads(response["body"]) == expected

    def test_update_handler(self, initialize_db):
        MockDatabase.COUNT_UUID = 20
        event = {
            "pathParameters": {
                "organization_id": "11111111-1111-1111-1111-111111111111",
                "onboarding_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
            },
            "body": get_file_content(f"{BODY_JSON_FOLDER}/body_update_handler.json")
        }

        response = self.update_handler(event, {})
        assert response["statusCode"] == 200
        expected = json.load(
            open(f"{EXPECTED_JSON_PATH}/expected_update_handler.json")
        )
        assert json.loads(response["body"]) == expected

    def test_delete_handler(self, initialize_db):
        event = {
            "pathParameters": {
                "organization_id": "11111111-1111-1111-1111-111111111111",
                "onboarding_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
            }
        }
        response = self.delete_single_handler(event, {})

        assert response["statusCode"] == 200
        expected = json.load(
            open(f"{EXPECTED_JSON_PATH}/expected_delete_single_handler.json")
        )
        assert json.loads(response["body"]) == expected
