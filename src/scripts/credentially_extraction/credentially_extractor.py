import asyncio
import os
import traceback
from asyncio import gather
from concurrent.futures import ThreadPoolExecutor

from scripts.credentially_extraction.credentially_api_request import CredentiallyApiRequest
from scripts.credentially_extraction.s3_utils_local import upload_file_to_s3


class CredentiallyExtractor:
    def __init__(self, token, app_name, bucket_folder_name, cred_organization_id):
        self.bucket_folder_name = bucket_folder_name
        self.cred_api_request = CredentiallyApiRequest(token, app_name, cred_organization_id)

    def begin_extraction(self):
        #print(f'START FOR: {self.bucket_folder_name}')
        #self.extract_organization_details()
        #print('organization_details extraction finished')
        #self.extract_organization_roles()
        #print('facilities extraction finished')
        #self.extract_document_types()
        #print('document_types extraction finished')
        #self.extract_reference_forms()
        #print('reference forms extraction finished')
        #self.extract_compliance_packages()
        #print('compliance packages extraction finished')
        #self.extract_organization_documents()
        #print('organization documents extraction finished')
        #self.extract_questionnaires()
        #print('questionnaires extraction finished')
        #self.extract_employees()
        #print('employees extraction finished')
        self.save_raw_data()

    def save_raw_data(self):
        base_folder = (f'original_json_objects/organizations/'
                       f'{self.cred_api_request.organization_id}_{self.cred_api_request.app_name}/')
        self.get_file_bytes_with_path(base_folder)

    def extract_organization_details(self):
        self.cred_api_request.get_organizations_details()


    def extract_organization_roles(self):
        self.cred_api_request.get_roles_list()

    def extract_document_types(self):
        self.cred_api_request.get_document_types_list()
        self.cred_api_request.get_document_types_all_list()

    def extract_reference_forms(self):
        data = {
            'content': []
        }
        page = 0
        while True:
            req = self.cred_api_request.get_reference_forms_list(page)
            data['content'] = data['content'] + req['content']
            page += 1
            if req.get('last'):
                break

        for form in data['content']:
            self.cred_api_request.get_reference_forms_single(form['id'])

    def extract_compliance_packages(self):
        page = 0
        while True:
            req = self.cred_api_request.get_compliance_package_list(page)
            page += 1
            if req.get('last'):
                break

    def extract_organization_documents(self):
        documents = self.cred_api_request.get_organization_documents_list()
        for document in documents:
            _, file_extension = os.path.splitext(document.get('filename'))
            self.cred_api_request.get_organization_document(document['id'], file_extension)

    def extract_questionnaires(self):
        self.cred_api_request.get_questionnaires_list()

    def extract_organization_onboardings(self):
        """
        'organization_details.json' same file contains onboarding
        """
        pass

    def extract_employees(self):
        data = {
            'content': []
        }
        page = 0
        while True:
            req = self.cred_api_request.get_employees_list(page)
            data['content'] = data['content'] + req['content']
            page += 1
            if req.get('last'):
                break

       # for employee in data['content']:
          #  self.extract_single_employee(employee)

        #tasks = [self.extract_single_employee(employee) for employee in data['content']]
        #await gather(*tasks)

        with ThreadPoolExecutor(max_workers=20) as executor:
            for employee in data['content']:
                executor.submit(self.extract_single_employee, employee)
            executor.shutdown(wait=True)

    def extract_single_employee(self, employee):
        try:
            print('start extracting employee ------')
            self.extract_employee_profile(employee)
            self.extract_employee_compliance_packages(employee)
            self.extract_employee_documents(employee)
            self.extract_employee_references(employee)
            self.extract_employee_questionnaires(employee)
            self.extract_employee_onboarding(employee)
            print(f'Inserted Employee CRED_ID={employee["id"]}')
        except Exception as e:
            traceback.print_exc()
            print(f'Error with Employee: CRED_ID={employee["id"]}')
            print(f'Error: {e}')

    def extract_employee_profile(self, employee):
        personal_information_page, contact_details_page = self.cred_api_request.get_employee_profile_pages(employee['id'])
        self.cred_api_request.get_employee_personal_info(employee['id'], personal_information_page)
        self.cred_api_request.get_employee_address_info(employee['id'], contact_details_page)

    def extract_employee_compliance_packages(self, employee):
        self.cred_api_request.get_employee_compliance_package_list(employee['id'])

    def extract_employee_documents(self, employee):
        data = self.cred_api_request.get_employee_documents_list(employee['id'])
        for document in data.get('documents', []):
            document_file = document['activeFile']
            self.cred_api_request.get_employee_document(employee['id'], document['id'], document_file)

    def extract_employee_references(self, employee):
        references = self.cred_api_request.get_employee_references_list(employee['id'])
        for reference in references:
            if reference.get('file'):
                self.cred_api_request.get_employee_reference_file(employee['id'], reference['id'], reference.get('file'))
            else:
                self.cred_api_request.get_employee_reference_answers(employee['id'], reference['id'])

    def extract_employee_questionnaires(self, employee):
        self.cred_api_request.get_employee_questionnaires_list(employee['id'])

    def extract_employee_onboarding(self, employee):
        """
        employees/{employee_id}/documents.json same file contains onboarding Steps
        """
        pass

    def get_file_bytes_with_path(self, folder_path):
        """
        Recursively opens all files in a folder and its subfolders, gets their bytes, and stores the complete folder path as a relative path.

        Args:
        folder_path: The path to the folder containing the files.

        Returns:
        A list of tuples, where each tuple contains the file path and its bytes.
        """
        results = []
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            if os.path.isfile(file_path):
                with open(file_path, "rb") as f:
                    upload_file_to_s3(f'{self.bucket_folder_name}/' + file_path, f.read(), 'credentially-exports')
            else:
                results.extend(self.get_file_bytes_with_path(file_path))  # Recursively call for subfolders
        return results
