from sqlalchemy import create_engine
from urllib.parse import quote_plus, quote
from sqlalchemy.schema import CreateTable

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
    f"/{os.getenv('DB_DATABASE')}"
)

# TODO: Refactor password handling for special characters compatibility (#@!...)
#
# connection_string = f"mysql+pymysql://{os.getenv('DB_USERNAME')}:" \
#                    f"{quote(os.getenv('DB_PASSWORD'))}@" \
#                    f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}"
#

engine = create_engine(connection_string, echo=True)
Base.metadata.reflect(engine)

# Generate SQL statement without executing it
create_sql_organizations = CreateTable(Organization.__table__).compile(engine)
create_sql_roles = CreateTable(Role.__table__).compile(engine)
create_sql_compliance_package = CreateTable(CompliancePackage.__table__).compile(engine)
create_sql_document_type = CreateTable(DocumentType.__table__).compile(engine)
create_sql_package_role = CreateTable(PackageRole.__table__).compile(engine)
create_sql_package_document = CreateTable(PackageDocument.__table__).compile(engine)
create_sql_organization_document = CreateTable(OrganizationDocument.__table__).compile(engine)
create_sql_organization_document_role = CreateTable(OrganizationDocumentRole.__table__).compile(engine)
create_sql_questionnaire = CreateTable(Questionnaire.__table__).compile(engine)
create_sql_onboarding = CreateTable(Onboarding.__table__).compile(engine)
create_sql_onboarding_step = CreateTable(OnboardingStep.__table__).compile(engine)
create_sql_step_role = CreateTable(StepRole.__table__).compile(engine)


# Print the SQL statement for analysis

print("Roles" + "-" * 20)
print(create_sql_roles.string)
print("CompliancePackage" + "-" * 20)
print(create_sql_compliance_package)
print("DocumentType" + "-" * 20)
print(create_sql_document_type)
print("PackageRole" + "-" * 20)
print(create_sql_package_role)
print("PackageDocument" + "-" * 20)
print(create_sql_package_document)
print("OrganizationDocument" + "-" * 20)
print(create_sql_organization_document)
print("OrganizationDocumentRole" + "-" * 20)
print(create_sql_organization_document_role)
print("Roles" + "-" * 20)
print(create_sql_questionnaire.string)
print("Roles" + "-" * 20)
print(create_sql_onboarding.string)
print("Roles" + "-" * 20)
print(create_sql_onboarding_step.string)
print("Roles" + "-" * 20)
print(create_sql_step_role.string)
# Create all tables:

Base.metadata.create_all(engine)
