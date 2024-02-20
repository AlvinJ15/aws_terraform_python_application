import uuid
from datetime import datetime

from sqlalchemy.orm import sessionmaker
from sqlalchemy import engine_from_config
from pyramid.config import Configurator

from api_services.utils import credentials_utils


class DataBase:
    _session_local = None  # Class-level attribute for singleton

    @classmethod
    def create_session(cls):
        credentials = credentials_utils.retrieve_credentials()
        connection_string = (
            f"mysql+pymysql://{credentials.get('username')}:"
            f"{credentials.get('password')}"
            f"@{credentials.get('host')}:{credentials.get('port')}"
            f"/{credentials.get('dbname')}"
        )
        config = Configurator(settings={"sqlalchemy.url": connection_string})
        config.scan('data_models')  # the "important" line
        engine = engine_from_config(config.get_settings(), 'sqlalchemy.')

        session_local = sessionmaker(autocommit=False, autoflush=True, bind=engine, expire_on_commit=False)
        return session_local()

    @classmethod
    def get_session(cls):
        if not DataBase._session_local:
            try:
                DataBase._session_local = cls.create_session()  # Initialize singleton
            except Exception as e:
                print(e)
        return DataBase._session_local

    @classmethod
    def generate_uuid(cls):
        return str(uuid.uuid4())

    @classmethod
    def get_now(cls):
        return datetime.now()

    @classmethod
    def pop_non_updatable_fields(cls, keys, data):
        for key in keys:
            if key in data:
                data.pop(key)
