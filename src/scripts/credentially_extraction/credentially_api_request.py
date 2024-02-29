import datetime
import json
import os

import requests


class CredentiallyApiRequest:
    def __init__(self, token, app_name, organization_id):
        self.token = token
        self.app_name = app_name
        self.organization_id = organization_id
        self.base_folder = f'original_json_objects/organizations/{organization_id}_{app_name}/'
        self.retries = 3

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
        current_request = 0
        response = None
        while current_request < self.retries:
            response = requests.get(self.__build_request(api), headers=self.__get_headers())
            if response.status_code == 401:
                self.token = self.ask_for_new_token()
            if response.status_code == 200:
                if is_json:
                    if len(response.text) > 0:
                        return json.loads(response.text)
                    else:
                        return {}
                else:
                    return response.content
            else:
                current_request += 1

        print(f'Error for request {api}: ', response.text)
        raise Exception(f'Error request: {api}')

    def __save_request(self, data, file_name):
        full_path = os.path.join(self.base_folder, file_name)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        if isinstance(data, bytes):
            with open(full_path, "wb") as f:
                f.write(data)
        elif data:
            with open(full_path, "w") as f:
                f.write(json.dumps(data))

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

    def get_reference_forms_list(self, page) -> {}:
        api_url = f'mp/api/organisations/{self.organization_id}/reference-forms?page={page}'  # uses app_name
        response = self.__made_request(api_url)
        self.__save_request(response, f'reference_forms/reference_forms_page_{page}.json')
        return response

    def get_reference_forms_single(self, reference_form_id) -> list:
        api_url = f'mp/api/organisations/{self.organization_id}/reference-forms/{reference_form_id}'  # uses app_name
        response = self.__made_request(api_url)
        self.__save_request(response, f'reference_forms/{reference_form_id}.json')
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

    def get_compliance_package_list(self, page) -> dict:
        api_url = f'mp/api/v1/organisations/{self.organization_id}/compliance/packages?page={page}&detailed=true'  # pagination
        response = self.__made_request(api_url)
        self.__save_request(response, f'compliance_packages/compliance_packages_page_{page}.json')
        return response

    def get_organization_documents_list(self) -> list:
        api_url = f'mp/api/organisations/{self.organization_id}/documents'  # pagination
        response = self.__made_request(api_url)
        self.__save_request(response, 'organization_documents.json')
        return response

    def get_organization_document(self, org_doc_id, file_extension):
        api_url = f'mp/api/organisations/{self.organization_id}/documents/{org_doc_id}/preview'
        response = self.__made_request(api_url, is_json=False)
        self.__save_request(response, f'organization_documents/{org_doc_id}{file_extension}')
        return response

    def get_employees_list(self, page) -> dict:
        api_url = f'mp/api/organisations/{self.organization_id}/employees?page={page}'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/employees_page_{page}.json')
        return response

    def get_employee_profile_pages(self, employee_id):
        personal_information_page = 31
        contact_details_page = 17
        api_url = f'mp/api/v1/employees/{employee_id}/profile-pages'
        response = self.__made_request(api_url)
        for page in response:
            if page['route'] == 'profile-details':
                api_url = f'mp/api/v1/employees/{employee_id}/profile-pages/{page["id"]}'
                response = self.__made_request(api_url)
                sections = response['sections']

                for section in sections:
                    if section['title'] == 'Personal Information':
                        personal_information_page = section['id']
                    if section['title'] == 'Contact Details':
                        contact_details_page = section['id']

        return personal_information_page, contact_details_page

    def get_employee_personal_info(self, employee_id, page_id) -> dict:
        api_url = f'mp/api/v1/employees/{employee_id}/profile-sections/{page_id}/fields/values'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/{employee_id}/personal_info.json')
        return response

    def get_employee_address_info(self, employee_id, page_id) -> dict:
        api_url = f'mp/api/v1/employees/{employee_id}/profile-sections/{page_id}/fields/values'
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
        self.__save_request(response, f'employees/{employee_id}/documents.json')
        return response

    def get_employee_document(self, employee_id, document_id, file):
        api_url = f'mp/api/files/{file["id"]}/preview'
        response = self.__made_request(api_url, is_json=False)
        if not response:
            print(f'Error downloading the document id={document_id} for employee id={employee_id}')
        self.__save_request(response, f'employees/{employee_id}/documents/{document_id}/{file["originName"]}')
        return response

    def get_employee_references_list(self, employee_id) -> list:
        api_url = f'mp/api/employees/{employee_id}/references'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/{employee_id}/references.json')
        return response

    def get_employee_reference_file(self, employee_id, reference_id, file):
        api_url = f'mp/api/employees/{employee_id}/references/{reference_id}/file/preview'
        response = self.__made_request(api_url, is_json=False)
        self.__save_request(response, f'employees/{employee_id}/references/{reference_id}/{file["originName"]}')
        return response

    def get_employee_reference_answers(self, employee_id, reference_id):
        api_url = f'mp/api/employees/{employee_id}/references/{reference_id}/answers'
        response = self.__made_request(api_url)
        self.__save_request(response, f'employees/{employee_id}/references/{reference_id}.json')
        return response

    def ask_for_new_token(self):
        new_token = input('Enter the new ACCESS_TOKEN: ')
        return new_token
