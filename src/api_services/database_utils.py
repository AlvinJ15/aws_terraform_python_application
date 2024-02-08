from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from api_services import credentials_utils

credentials = credentials_utils.retrieve_credentials()
connection_string = (
    f"mysql+pymysql://{credentials.get('username')}:"
    f"{credentials.get('password')}"
    f"@{credentials.get('host')}:{credentials.get('port')}"
    f"/{credentials.get('dbname')}"
)

engine = create_engine(connection_string)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    # Return a new session from the global engine
    return SessionLocal()
