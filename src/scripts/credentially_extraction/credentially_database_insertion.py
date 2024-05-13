import asyncio
import datetime
import json
import os
import traceback
from concurrent.futures import ThreadPoolExecutor

import requests

from data_models.model_administrator import Administrator
from data_models.model_compliance_package import CompliancePackage
from data_models.model_document_type import DocumentType
from data_models.model_employee import Employee
from data_models.model_employee_compliance_package import EmployeeCompliancePackage
from data_models.model_employee_document import EmployeeDocument
from data_models.model_employee_profile import EmployeeProfile
from data_models.model_employee_questionnaire_response import EmployeeQuestionnaireResponse
from data_models.model_organization import Organization
from data_models.model_package_document import PackageDocument
from data_models.model_package_facility import PackageFacility
from data_models.model_questionnaire import Questionnaire
from data_models.model_facilities import Facility
from scripts.credentially_extraction.credentially_api_request import CredentiallyApiRequest
from scripts.credentially_extraction.database_utils_local import DataBase
from scripts.credentially_extraction.s3_utils_local import upload_file_to_s3

STAGE = 'prod'


class CredentiallyDatabaseInsertion:

    def __init__(self, token, app_name, bucket_folder_name, organization_id, cred_organization_id):
        self.organization = None
        self.bucket_folder_name = bucket_folder_name
        self.organization_id = organization_id
        self.cred_api_request = CredentiallyApiRequest(token, app_name, cred_organization_id)
        self.roles_id_map = {}
        self.document_type_id_map = {}
        self.document_types = {}
        self.package_id_map = {}
        self.package_name_id_map = {}
        self.employee_id_map = {}
        self.request_employees = {}
        self.questionnaire_id_mapping = {}
        self.admin_list_id = []
        self.employee_compliance_package = {}
        self.org_folder = (
            f'original_json_objects/organizations/'
            f'{self.cred_api_request.organization_id}_{self.cred_api_request.app_name}'
        )
        self.time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")


    def begin_extraction(self):
        with DataBase.get_session() as db:
            self.admins_map = self.get_admins_map()
            self.fill_organization_details(db)
            print('organization_details extraction finished')
            self.create_roles(db)
            print('facilities extraction finished')
            self.create_document_types(db)
            print('document_types extraction finished')
            self.create_questionnaires(db)
            print('questionnaires extraction finished')
            self.create_compliance_packages(db)
            print('compliance_packages extraction finished')
            self.create_employees(db)
            print('employees extraction finished')
            self.save_mappings()
            db.commit()

    def save_mappings(self, upload_to_s3=True):
        base_folder = (f'original_json_objects/id_mappings/'
                       f'{self.cred_api_request.organization_id}_{self.cred_api_request.app_name}/{self.time}/')
        os.makedirs(base_folder, exist_ok=True)

        with open(os.path.join(base_folder, 'roles_id_map.json'), "w") as f:
            f.write(json.dumps(self.roles_id_map))
        with open(os.path.join(base_folder, 'document_type_id_map.json'), "w") as f:
            f.write(json.dumps(self.document_type_id_map))
        with open(os.path.join(base_folder, 'package_id_map.json'), "w") as f:
            f.write(json.dumps(self.package_id_map))
        with open(os.path.join(base_folder, 'employee_id_map.json'), "w") as f:
            f.write(json.dumps(self.employee_id_map))
        with open(os.path.join(base_folder, 'questionnaire_id_mapping.json'), "w") as f:
            f.write(json.dumps(self.questionnaire_id_mapping))
        #self.time = '2024-02-26_19-59-42'  # set raw date to save this
        # mappings
        self.get_file_bytes_with_path(base_folder)


    def fill_organization_details(self, db):
        data = json.load(open(f'{self.org_folder}/organization_details.json'))
        organization = db.query(Organization).filter_by(id=self.organization_id).first()
        self.organization = organization
        mapping_type = {
            'PRIVATE_COMPANY': 'Private Company',
            'GP': 'GP'
        }
        organization.type = mapping_type[data.get('type')]
        organization.name = data.get('name')
        organization.legal_name = data.get('legalName')
        organization.country = data.get('country')
        organization.address1 = data.get('address1')
        organization.address2 = data.get('address2')
        organization.city = data.get('city')
        organization.state = data.get('state')
        organization.zip = data.get('postcode')

    def create_roles(self, db):
        data = json.load(open(f'{self.org_folder}/facilities.json'))
        mapping_type = {
            'NON_CLINICAL': 'Non-Clinical',
            'CLINICAL': 'Clinical'
        }
        for cred_role in data:
            new_role = Facility()
            new_role.role_id = DataBase.generate_uuid()
            self.roles_id_map[cred_role['id']] = new_role.role_id
            new_role.organization_id = self.organization_id
            new_role.name = cred_role['name']
            new_role.description = cred_role.get('description')
            new_role.type = mapping_type[cred_role['staffType']]
            db.add(new_role)
        db.flush()

    def create_document_types(self, db):
        document_type = json.load(open(f'{self.org_folder}/document_types.json'))
        document_type_others = json.load(open(f'{self.org_folder}/document_types_all.json'))
        data = document_type_others + document_type
        mapping_type = {
            'personal': 'Personal',
            'certificates': 'Certificates',
            'other': 'Personal'
        }
        for cred_doc_type in data:
            new_document_type = DocumentType()
            new_document_type.id = DataBase.generate_uuid()
            self.document_type_id_map[cred_doc_type['id']] = new_document_type.id
            new_document_type.organization_id = self.organization_id
            new_document_type.name = cred_doc_type['name']
            new_document_type.description = cred_doc_type.get('description')
            new_document_type.category = mapping_type[cred_doc_type['category']]
            new_document_type.expiration = cred_doc_type.get('expiryPeriodInMonths')
            self.document_types[cred_doc_type['id']] = new_document_type
            db.add(new_document_type)

        db.flush()

    #  TODO: Implement onboardigngs with onboardings steps, is the same documents json
    def create_onboardings(self, db):
        pass

    def create_questionnaires(self, db):
        data = []
        path = f'{self.org_folder}/questionnaires.json'
        if os.path.exists(path):
            data = json.load(open(path))

        for questionnaire in data:
            new_questionnaire = Questionnaire()
            new_questionnaire.questionnaire_id = DataBase.generate_uuid()
            self.questionnaire_id_mapping[questionnaire['id']] = new_questionnaire.questionnaire_id
            new_questionnaire.organization_id = self.organization_id
            new_questionnaire.title = questionnaire['title']
            new_questionnaire.definition = {'questions': questionnaire['form']['schema']['items']}
            db.add(new_questionnaire)
        db.flush()

    def create_compliance_packages(self, db, page=0):
        packages = []
        path = f'{self.org_folder}/compliance_packages'
        for package in os.listdir(path):
            packages += json.load(open(f'{path}/{package}'))['content']

        for cred_package in packages:
            new_package = CompliancePackage()
            new_package.package_id = DataBase.generate_uuid()
            self.package_id_map[cred_package['id']] = new_package.package_id
            if cred_package['name'] in self.package_name_id_map:
                raise Exception(
                    f'Error more that 1 name repeated in compliance_package '
                    f'with credentially name={cred_package["name"]}'
                )
            self.package_name_id_map[cred_package['name']] = new_package.package_id
            new_package.organization_id = self.organization_id
            new_package.name = cred_package['name']
            new_package.creation_date = DataBase.get_now()
            db.add(new_package)
            db.flush()
            roles = cred_package.get('facilities', [])
            for role in roles:
                new_package_role = PackageFacility()
                new_package_role.package_id = new_package.package_id
                new_package_role.role_id = self.roles_id_map[role['roleId']]
                db.add(new_package_role)

            groups = cred_package.get('groups', [{}])
            if len(groups) > 1:
                raise Exception(f'Error more that 1 group in compliance_package '
                                f'with credentially id={cred_package["id"]}')
            documents = groups[0].get('requirements', [])
            for document in documents:
                if document['type'] == 'DOCUMENT_TYPE':  # Ignoring Reference Types
                    document_type = document['documentType']
                    new_package_document = PackageDocument()
                    new_package_document.package_id = new_package.package_id
                    new_package_document.document_type_id = self.document_type_id_map[document_type['id']]
                    db.add(new_package_document)

    def create_employees(self, db):
        employees = []
        for page in os.listdir(f'{self.org_folder}/employees'):
            if os.path.isfile(os.path.join(f'{self.org_folder}/employees', page)):
                employees += json.load(open(f'{self.org_folder}/employees/{page}'))['content']

        employees_list = []
        for employee in employees:
            new_employee = Employee()
            new_employee.employee_id = DataBase.generate_uuid()
            self.employee_id_map[employee['id']] = new_employee.employee_id
            self.request_employees[employee['id']] = employee
            new_employee.organization_id = self.organization_id
            if employee.get('assignees'):
                new_employee.assignee_id = employee.get('assignees')[-1]['id']
            compliance_tags = [tag['key'] for tag in employee.get('complianceStatusTags', [])]
            new_employee.compliance_tags = ','.join(compliance_tags)
            new_employee.user_tags = ','.join(employee.get('tags', []))
            #jobs_status = [job['status'] == 'ACTIVE' for job in employee.get('jobs', [])]
            #if employee.get('jobs'):
            #    new_employee.status = 'ACTIVE' if any(jobs_status) else employee.get('jobs')[0].get('status')
            new_employee.status = employee.get('employeeComplianceStatus')
            new_employee.created = DataBase.get_now()
            employees_list.append(new_employee)

        for new_employee, employee in zip(employees_list, employees):
            self.extract_single_employee(db, new_employee, employee)

    def extract_single_employee(self, db, new_employee, employee):
        try:
            if new_employee.assignee_id:
                request_employee = self.request_employees.get(new_employee.assignee_id)
                if request_employee and request_employee.get('email') in self.admins_map:
                    email = request_employee.get('email', 'default')
                    new_employee.assignee_id = self.admins_map[email]
                else:
                    new_employee.assignee_id = self.admins_map['default']
            else:
                new_employee.assignee_id = None
            db.add(new_employee)
            db.flush()
            self.create_employee_profile(new_employee, employee)
            self.create_employee_compliance_packages(db, new_employee, employee)
            self.create_employee_questionnaire(db, new_employee, employee)
            self.create_employee_documents(db, new_employee, employee)
            print(f'Inserted Employee CRED_ID={employee["id"]}, Organization={self.bucket_folder_name}')
        except Exception as e:
            traceback.print_exc()
            print(f'Error with Employee: CRED_ID={employee["id"]}')
            print(f'Error: {e}')

    def create_employee_profile(self, new_employee, employee):
        profile_path = f'{self.org_folder}/employees/{employee["id"]}/personal_info.json'
        address_path = f'{self.org_folder}/employees/{employee["id"]}/address_info.json'
        employee_info = employee_address = {}
        if os.path.exists(profile_path):
            employee_info = json.load(open(profile_path))
        if os.path.exists(address_path):
            employee_address = json.load(open(address_path)).get('Home Address', {})

        new_employee.profile = EmployeeProfile()
        new_employee.profile.profile_id = DataBase.generate_uuid()
        new_employee.profile.employee_id = new_employee.employee_id
        new_employee.profile.title = employee_info.get('Title')
        new_employee.profile.first_name = employee_info.get('First Name')
        new_employee.profile.last_name = employee_info.get('Last Name')
        new_employee.profile.gender = employee_info.get('Gender')
        new_employee.profile.email = employee.get('email')
        new_employee.profile.facility = employee['personnelType']['name']
        new_employee.profile.grade = employee_info.get('Grade')
        new_employee.profile.medical_category = employee_info.get('Medical Category')
        new_employee.profile.specialty = employee_info.get('Specialty')
        if employee_info.get('Date of Birth'):
            new_employee.profile.date_of_birth = datetime.datetime.strptime(employee_info.get('Date of Birth'),
                                                                            '%Y-%m-%d')
        new_employee.profile.address = employee_address.get('Address Line 1')
        new_employee.profile.country = employee_address.get('Country', 'United States')
        new_employee.profile.city = employee_address.get('City')
        new_employee.profile.state = employee_address.get('State')
        new_employee.profile.zip = employee_address.get('ZIP')

    def create_employee_compliance_packages(self, db, new_employee, employee):
        path = f'{self.org_folder}/employees/{employee["id"]}/compliance_packages.json'
        employee_packages = []
        if os.path.exists(path):
            employee_packages = json.load(open(path))

        for package in employee_packages:
            new_employee_package = EmployeeCompliancePackage()
            new_employee_package.package_id = self.package_name_id_map[package['name']]
            new_employee_package.employee_id = new_employee.employee_id
            key = f'{new_employee.employee_id}-{new_employee_package.package_id}'
            if key in self.employee_compliance_package:
                print('ERROR REPEATED COMPLIANCE PACKAGE: ')
            else:
                self.employee_compliance_package[key] = employee
            db.add(new_employee_package)

    def create_employee_questionnaire(self, db, new_employee, employee):
        mapping_status = {
            'COMPLETED': 'Completed',
            'NOT_COMPLETED': 'Not Completed',
            'DRAFT': 'Draft'
        }
        path = f'{self.org_folder}/employees/{employee["id"]}/questionnaires.json'
        questionnaires = []
        if os.path.exists(path):
            questionnaires = json.load(open(path))
        for questionnaire in questionnaires:
            new_employee_quest = EmployeeQuestionnaireResponse()
            new_employee_quest.response_id = DataBase.generate_uuid()
            new_employee_quest.employee_id = new_employee.employee_id
            new_employee_quest.questionnaire_id = self.questionnaire_id_mapping[questionnaire['questionnaireId']]
            new_employee_quest.response = {'answers': questionnaire.get('answers', [])}
            new_employee_quest.status = mapping_status[questionnaire.get('status', 'DRAFT')]
            if questionnaire.get('completed'):
                new_employee_quest.completed = datetime.datetime.strptime(
                    questionnaire.get('completed'), '%Y-%m-%dT%H:%M:%S'
                )
            db.add(new_employee_quest)

    def create_employee_documents(self, db, new_employee: Employee, employee):
        data = json.load(open(f'{self.org_folder}/employees/{employee["id"]}/documents.json'))
        for document in data.get('documents', []):
            document_file = document['activeFile']
            new_document = EmployeeDocument()
            new_document.document_id = DataBase.generate_uuid()
            new_document.employee_id = new_employee.employee_id
            new_document.document_type_id = self.document_type_id_map[document['type']['id']]
            expiry_date = document_file.get('expiry')
            if expiry_date:
                new_document.expiry_date = datetime.datetime.strptime(expiry_date, '%Y-%m-%d')
            new_document.document_number = document_file.get('documentNumber')
            verifications = document_file.get('verifications')
            new_document.status = 'Awaiting Approval'
            if verifications and len(verifications) > 0:
                last_verification = verifications[-1]
                if last_verification.get('verificationType') == 'APPROVED':
                    new_document.status = 'Approved'
                    approval_date = last_verification.get('created')
                    new_document.approval_date = datetime.datetime.strptime(
                        approval_date, '%Y-%m-%dT%H:%M:%S'
                    ) if approval_date else None
                    approver_id = self.employee_id_map.get(last_verification['verifier']['id'])
                    approver = self.request_employees.get(approver_id, {})
                    approver_email = approver.get('email', 'default')
                    new_document.approver_id = self.admins_map[approver_email]
                elif verifications[-1].get('verificationType') == 'DECLINED':
                    new_document.status = 'Rejected'
            if document_file.get('daysToExpire', 0) < 0:
                new_document.status = 'Expired'

            new_document.upload_date = datetime.datetime.strptime(
                document_file['created'], '%Y-%m-%dT%H:%M:%S'
            )
            document_type = self.document_types[document['type']['id']]
            path = (
                f'{STAGE}/app_data/orgs/{self.organization.name} {DataBase.get_now().year}/'
                f'Ongoing/{new_employee.profile.get_name()} - '
                f'{new_employee.profile.facility}/01 License, Certification and Verification/'
                f'{new_employee.profile.get_name()} - '
                f'{document_type.category} - {document_type.name}.'
                f'{document["activeFile"].get("originName").split(".")[-1]}'
            )
            #document_bytes = self.cred_api_request.get_employee_document(document_file)
            path_file = f'{self.org_folder}/employees/{employee["id"]}/documents/{document["id"]}'
            files = os.listdir(path_file)
            if len(files) > 0:
                with open(f'{path_file}/{files[0]}', "rb") as file:
                    document_bytes = file.read()
                    new_document.s3_path = upload_file_to_s3(path, document_bytes)
            else:
                raise Exception('Error document doesnt have a file')

            db.add(new_document)

    def get_admins_map(self):
        return {
            'regine.desacula@tollanis.com': '99ad0db6-cbf0-4c2b-8152-37537c5c5a2e',
            'mary.reyes@tollanis.com': '0936234f-6858-4789-8fe5-84c861145bcf',
            'grace.angelica@tollanis.com': 'b696c0cf-842f-4373-9c16-b7aa2289b9b5',
            'justine.malubay@tollanis.com': '57955069-52e5-4b35-b123-c6f47d0bb7d6',
            'nikko.reyes@tollanis.com': 'ea3507ec-794d-4627-9bd2-668f5e7111b1',
            'richelle.gordove@tollanis.com': '7f2dbe31-437e-435a-a73f-64a95e5c91da',
            'tina.marietan@tollanis.com': '526b6c7d-5221-4873-bb8c-c04e88d0f22b',
            'default': '99ad0db6-cbf0-4c2b-8152-37537c5c5a2e'
        }

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
