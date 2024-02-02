from sqlalchemy import create_engine
from urllib.parse import quote_plus, quote
from sqlalchemy.schema import CreateTable

from model_roles import Role
from model_compliance_package import CompliancePackage
from model_document_type import DocumentType
from model_package_role import PackageRole
from model_package_document import PackageDocument

from models import Base

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

engine = create_engine(connection_string)
Base.metadata.reflect(engine)


# Generate SQL statement without executing it
create_sql_roles = CreateTable(Role.__table__).compile(engine)
create_sql_compliance_package = CreateTable(CompliancePackage.__table__).compile(engine)
create_sql_document_type = CreateTable(DocumentType.__table__).compile(engine)
create_sql_package_role = CreateTable(PackageRole.__table__).compile(engine)
create_sql_package_document = CreateTable(PackageDocument.__table__).compile(engine)

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

# Create all tables:
Base.metadata.create_all(engine)
