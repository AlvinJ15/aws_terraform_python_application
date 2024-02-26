from sqlalchemy import create_engine
from urllib.parse import quote_plus, quote
from sqlalchemy.schema import CreateTable

from data_models.model_administrator import Administrator
from data_models.model_employee import Employee
from data_models.model_employee_compliance_package import EmployeeCompliancePackage
from data_models.model_employee_document import EmployeeDocument
from data_models.model_employee_profile import EmployeeProfile
from data_models.model_employee_questionnaire_response import EmployeeQuestionnaireResponse
from data_models.model_employee_reference import EmployeeReference
from data_models.model_onboarding import Onboarding
from data_models.model_onboarding_step import OnboardingStep
from data_models.model_organization_document import OrganizationDocument
from data_models.model_organization_document_role import OrganizationDocumentRole
from data_models.model_questionnaire import Questionnaire
from data_models.model_roles import Role
from data_models.model_organization import Organization
from data_models.model_compliance_package import CompliancePackage
from data_models.model_document_type import DocumentType
from data_models.model_package_role import PackageRole
from data_models.model_package_document import PackageDocument
from data_models.model_step_role import StepRole

from data_models.models import Base

import os

# Database connection (or replace with your credentials)
connection_string = (
    f"mysql+pymysql://{os.getenv('DB_USERNAME')}:"
    f"{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}"
    f"/{os.getenv('DB_NAME')}"
)

# TODO: Refactor password handling for special characters compatibility (#@!...)
#
# connection_string = f"mysql+pymysql://{os.getenv('DB_USERNAME')}:" \
#                    f"{quote(os.getenv('DB_PASSWORD'))}@" \
#                    f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}"
#

engine = create_engine(connection_string, echo=True)
Base.metadata.reflect(engine)

classes_list = [
    Organization,
    Role,
    CompliancePackage,
    DocumentType,
    PackageRole,
    PackageDocument,
    OrganizationDocument,
    OrganizationDocumentRole,
    Questionnaire,
    Onboarding,
    OnboardingStep,
    StepRole,
        Administrator,
    Employee,
    EmployeeProfile,
    EmployeeDocument,
    EmployeeReference,
    EmployeeQuestionnaireResponse,
    EmployeeCompliancePackage
]

# Generate SQL statement without executing it
for cls in classes_list:
    sql = CreateTable(cls.__table__).compile(engine)
    # Print the SQL statement for analysis
    print(cls.__tablename__ + "-" * 20)
    print(sql.string)

# Create all tables:

Base.metadata.create_all(engine)
