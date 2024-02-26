import datetime
import json
import os

import requests


class CredentiallyApiRequest:
    def __init__(self, token, app_name, organization_id):
        self.token = token
        self.app_name = app_name
        self.organization_id = organization_id
        self.time = self.__generate_time()
        self.base_folder = f'original_json_objects/organizations/{organization_id}/{self.time}/'

    def __generate_time(self):
        now = datetime.datetime.now()
        timestamp_folder = now.strftime("%Y-%m-%d_%H-%M-%S")
        return timestamp_folder

    def __get_base_url(self):
        return f'https://{self.app_name}.us.credentially.io'

    def __get_headers(self):
        return {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=UTF-8'
        }

    def __build_request(self, api):
        return f'{self.__get_base_url()}/{api}'

    def __made_request(self, api, is_json=True):
        response = requests.get(self.__build_request(api), headers=self.__get_headers())
        if response.status_code == 200:
            if is_json:
                return json.loads(response.text)
            else:
                return response.content
        else:
            print(f'Error for request {api}: ', response.text)
            raise Exception(f'Error request: {api}')

    def __save_request(self, json_dict, file_name):
        if json_dict:
            full_path = os.path.join(self.base_folder, file_name)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, "w") as f:
                f.write(json.dumps(json_dict))

    def get_organizations_details(self) -> dict:
        api_url = f'mp/api/organisations/{self.organization_id}'
        response = self.__made_request(api_url)
        self.__save_request(response, 'organization_details.json')
        return response

    def get_roles_list(self) -> list:
        api_url = f'mp/api/organisations/{self.organization_id}/roles'
        response = self.__made_request(api_url)
        self.__save_request(response, 'roles.json')
        return response

    def get_document_types_list(self) -> list:
        api_url = 'mp/api/v1/document-types?detailed=true'  # uses app_name
        response = self.__made_request(api_url)
        self.__save_request(response, 'document_types.json')
        return response

    def get_document_types_all_list(self) -> list:
        api_url = 'mp/api/v1/document-types?common=true'  # uses app_name
        response = self.__made_request(api_url)
        self.__save_request(response, 'document_types_all.json')
        return response

    def get_onboardings_list(self) -> list:
        response = self.get_organizations_details()
        self.__save_request(response, 'onboardings.json')
        return response

    def get_questionnaires_list(self) -> list:
        api_url = f'mp/api/organisations/{self.organization_id}/questionnaires'
        response = self.__made_request(api_url)
        self.__save_request(response, 'questionnaires.json')
        return response

    def get_compliance_package_list(self, page=0) -> dict:
        api_url = f'mp/api/v1/organisations/{self.organization_id}/compliance/packages?page={page}&detailed=true'  # pagination
        response = self.__made_request(api_url)
        self.__save_request(response, f'compliance_packages_page_{page}.json')
        return response

    def get_employees_list(self, page=0) -> dict:
        api_url = f'mp/api/organisations/{self.organization_id}/employees?page={page}'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/employees_{page}.json')
        return response

    def get_employee_personal_info(self, employee_id) -> dict:
        api_url = f'mp/api/v1/employees/{employee_id}/profile-sections/31/fields/values'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/{employee_id}/personal_info.json')
        return response

    def get_employee_address_info(self, employee_id) -> dict:
        api_url = f'mp/api/v1/employees/{employee_id}/profile-sections/17/fields/values'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/{employee_id}/address_info.json')
        return response

    def get_employee_compliance_package_list(self, employee_id) -> list:
        api_url = f'mp/api/v1/organisations/{self.organization_id}/employees/{employee_id}/compliance-packages'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/{employee_id}/compliance_packages.json')
        return response

    def get_employee_questionnaires_list(self, employee_id) -> list:
        api_url = f'mp/api/questionnaires/employees/{employee_id}'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/{employee_id}/questionnaires.json')
        return response

    def get_employee_documents_list(self, employee_id) -> dict:
        api_url = f'mp/api/employees/{employee_id}'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/{employee_id}/questionnaires.json')
        return response

    def get_employee_document(self, file_id):
        api_url = f'mp/api/files/{file_id}/preview'
        response = self.__made_request(api_url, is_json=False)
        return response

