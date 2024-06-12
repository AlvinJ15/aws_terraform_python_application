import uuid
from datetime import datetime
from urllib.parse import quote_plus

import boto3
from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

from api_services.utils import credentials_utils

session = boto3.session.Session()
client = session.client('rds')


class DataBase:
    _session_local = {}  # Class-level attribute for singleton

    @classmethod
    def create_session(cls, stage):
        credentials = credentials_utils.retrieve_credentials_tollacred(stage)
        path_to_certificate = 'api_services/utils/us-east-1-bundle.pem'

        token = client.generate_db_auth_token(
            DBHostname=credentials.get('host'), Port=credentials.get('port'),
            DBUsername=credentials.get('username'), Region='us-east-1'
        )

        connection_string = (
            f"mysql+pymysql://{credentials.get('username')}:"
            f"{quote_plus(token)}"
            f"@{credentials.get('host')}:{credentials.get('port')}"
            f"/{credentials.get('dbname')}"
        )

        config = Configurator(settings={"sqlalchemy.url": connection_string})
        config.scan('data_models')  # the "important" line
        engine = engine_from_config(
            config.get_settings(),
            'sqlalchemy.',
            connect_args={'ssl_ca': path_to_certificate}
        )

        session_local = sessionmaker(autocommit=False, autoflush=True, bind=engine, expire_on_commit=False)
        return session_local()

    @classmethod
    def get_session(cls, stage=None):
        if stage not in DataBase._session_local:
            DataBase._session_local[stage] = cls.create_session(stage)  # Initialize singleton

        return DataBase._session_local[stage]

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
