import datetime
import json
import os

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
from data_models.model_package_role import PackageRole
from data_models.model_questionnaire import Questionnaire
from data_models.model_roles import Role
from scripts.credentially_extraction.credentially_api_request import CredentiallyApiRequest
from scripts.credentially_extraction.database_utils_local import DataBase
from scripts.credentially_extraction.s3_utils_local import upload_file_to_s3

STAGE = 'dev'


class CredentiallyExtractor:

    def __init__(self, token, app_name, organization_id, cred_organization_id):
        self.organization = None
        self.organization_id = organization_id
        self.cred_api_request = CredentiallyApiRequest(token, app_name, cred_organization_id)
        self.roles_id_map = {}
        self.document_type_id_map = {}
        self.document_types = {}
        self.package_id_map = {}
        self.package_name_id_map = {}
        self.employee_id_map = {}
        self.questionnaire_id_mapping = {}

    def begin_extraction(self):
        with DataBase.get_session() as db:
            self.fill_organization_details(db)
            self.create_roles(db)
            self.create_document_types(db)
            self.create_questionnaires(db)
            self.create_compliance_packages(db)
            self.create_employees(db)
            db.commit()
            self.save_mappings()

    def save_mappings(self, upload_to_s3=True):
        base_folder = (f'original_json_objects/mappings/'
                       f'{self.cred_api_request.organization_id}/{self.cred_api_request.time}/')
        #base_folder = 'original_json_objects/'
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

        get_file_bytes_with_path(base_folder)


    def fill_organization_details(self, db):
        data = self.cred_api_request.get_organizations_details()
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
        data = self.cred_api_request.get_roles_list()
        mapping_type = {
            'NON_CLINICAL': 'Non-Clinical',
            'CLINICAL': 'Clinical'
        }
        for cred_role in data:
            new_role = Role()
            new_role.role_id = DataBase.generate_uuid()
            self.roles_id_map[cred_role['id']] = new_role.role_id
            new_role.organization_id = self.organization_id
            new_role.name = cred_role['name']
            new_role.description = cred_role.get('description')
            new_role.type = mapping_type[cred_role['staffType']]
            db.add(new_role)
        db.flush()

    def create_document_types(self, db):
        data = self.cred_api_request.get_document_types_list()
        mapping_type = {
            'personal': 'Personal',
            'certificates': 'Certificates'
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

        data = self.cred_api_request.get_document_types_all_list()
        for cred_doc_type in data:
            if cred_doc_type['id'] not in self.document_type_id_map:
                new_document_type = DocumentType()
                new_document_type.id = DataBase.generate_uuid()
                self.document_type_id_map[cred_doc_type['id']] = new_document_type.id
                new_document_type.organization_id = self.organization_id
                new_document_type.name = cred_doc_type['name']
                new_document_type.description = cred_doc_type.get('description')
                new_document_type.category = mapping_type.get(cred_doc_type['category'], 'Personal')
                new_document_type.expiration = cred_doc_type.get('expiryPeriodInMonths')
                self.document_types[cred_doc_type['id']] = new_document_type
                db.add(new_document_type)

        db.flush()

    def create_onboardings(self, db):
        pass

    def create_questionnaires(self, db):
        data = self.cred_api_request.get_questionnaires_list()
        for questionnaire in data:
            new_questionnaire = Questionnaire()
            new_questionnaire.questionnaire_id = DataBase.generate_uuid()
            self.questionnaire_id_mapping[questionnaire['id']] = new_questionnaire.questionnaire_id
            new_questionnaire.organization_id = self.organization_id
            new_questionnaire.title = questionnaire['title']
            new_questionnaire.definition = {'questions': questionnaire['form']['schema']['items']}
            db.add(new_questionnaire)
        db.flush()

    def create_compliance_packages(self, db):
        # TODO pagination more than 100 records
        data = self.cred_api_request.get_compliance_package_list()
        for cred_package in data['content']:
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
            roles = cred_package.get('roles', [])
            for role in roles:
                new_package_role = PackageRole()
                new_package_role.package_id = new_package.package_id
                new_package_role.role_id = self.roles_id_map[role['roleId']]
                db.add(new_package_role)

            groups = cred_package.get('groups', [{}])
            if len(groups) > 1:
                raise Exception(f'Error more that 1 group in compliance_package '
                                f'with credentially id={cred_package["id"]}')
            documents = groups[0].get('requirements', [])
            for document in documents:
                if document['type'] == 'DOCUMENT_TYPE':
                    document_type = document['documentType']
                    new_package_document = PackageDocument()
                    new_package_document.package_id = new_package.package_id
                    new_package_document.document_type_id = self.document_type_id_map[document_type['id']]
                    db.add(new_package_document)

    def create_employees(self, db):
        data = self.cred_api_request.get_employees_list()
        admin_list = []
        employees_list = []
        for employee in data['content']:
            new_employee = Employee()
            new_employee.employee_id = DataBase.generate_uuid()
            self.employee_id_map[employee['id']] = new_employee.employee_id
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
            if employee['personnelType']['name'] == 'Administrator':
                admin_list.append((new_employee.employee_id, employee))
            employees_list.append(new_employee)

        for new_employee_id, employee in admin_list:
            new_admin = Administrator()
            new_admin.admin_id = new_employee_id
            new_admin.first_name = employee.get('firstName')
            new_admin.last_name = employee.get('lastName')
            new_admin.email = employee.get('email')
            new_admin.created = DataBase.get_now()
            db.add(new_admin)
            db.flush()

        for new_employee, employee in zip(employees_list, data['content']):
            try:
                if new_employee.assignee_id:
                    new_employee.assignee_id = self.employee_id_map[new_employee.assignee_id]
                db.add(new_employee)
                db.flush()
                self.create_employee_profile(new_employee, employee)
                self.create_employee_compliance_packages(db, new_employee, employee)
                self.create_employee_questionnaire(db, new_employee, employee)
                self.create_employee_documents(db, new_employee, employee)
                print(f'Inserted Employee CRED_ID={employee["id"]}')
            except Exception as e:
                print(f'Error with Employee: CRED_ID={employee["id"]}')
                print(f'Error: {e}')

    def create_employee_profile(self, new_employee, employee):
        employee_info = self.cred_api_request.get_employee_personal_info(employee['id'])
        employee_address = self.cred_api_request.get_employee_address_info(employee['id']).get('Home Address', {})
        new_employee.profile = EmployeeProfile()
        new_employee.profile.profile_id = DataBase.generate_uuid()
        new_employee.profile.employee_id = new_employee.employee_id
        new_employee.profile.title = employee_info.get('Title')
        new_employee.profile.first_name = employee_info.get('First Name')
        new_employee.profile.last_name = employee_info.get('Last Name')
        new_employee.profile.gender = employee_info.get('Gender')
        new_employee.profile.email = employee.get('email')
        new_employee.profile.role = employee['personnelType']['name']
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
        employee_packages = self.cred_api_request.get_employee_compliance_package_list(employee['id'])

        for package in employee_packages:
            new_employee_package = EmployeeCompliancePackage()
            new_employee_package.package_id = self.package_name_id_map[package['name']]
            new_employee_package.employee_id = new_employee.employee_id
            db.add(new_employee_package)

    def create_employee_questionnaire(self, db, new_employee, employee):
        mapping_status = {
            'COMPLETED': 'Completed',
            'NOT_COMPLETED': 'Not Completed',
            'DRAFT': 'Draft'
        }
        data = self.cred_api_request.get_employee_questionnaires_list(employee['id'])
        for questionnaire in data:
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
        data = self.cred_api_request.get_employee_documents_list(employee['id'])
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
                    new_document.approver_id = self.employee_id_map[last_verification['verifier']['id']]
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
                f'{new_employee.profile.role}/01 License, Certification and Verification/'
                f'{new_employee.profile.get_name()} - '
                f'{document_type.category} - {document_type.name}.'
                f'{document["activeFile"].get("originName").split(".")[-1]}'
            )
            document_bytes = self.cred_api_request.get_employee_document(document_file['id'])
            new_document.s3_path = upload_file_to_s3(path, document_bytes)
            db.add(new_document)

def get_file_bytes_with_path(folder_path):
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
                upload_file_to_s3('Tollanis-training/' + file_path, f.read(), 'credentially-exports')
        else:
            results.extend(get_file_bytes_with_path(file_path))  # Recursively call for subfolders
    return results
