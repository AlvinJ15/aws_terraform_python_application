import logging
from datetime import datetime

from pyramid.config import Configurator
from sqlalchemy import SmallInteger
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

from data_models.models import Base


def mock_get_collation_ids():
    return ''


def mock_get_tinyint_class():
    return SmallInteger


class MockDatabase:
    COUNT_UUID = 0
    _mock_date = datetime(2000, 1, 1, 0, 0, 0)  # Fixed Date for test dates

    @classmethod
    def mock_create_session(cls):
        test_database_url = 'sqlite:///:memory:'

        config = Configurator(settings={"sqlalchemy.url": test_database_url})
        config.scan('data_models')  # the "important" line
        engine = engine_from_config(config.get_settings(), 'sqlalchemy.', echo=False)
        engine.logger.setLevel(logging.INFO + 1)  # Set level above INFO (e.g., WARNING or ERROR)
        session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        session_local = session_local()

        # Create all tables automatically before creating the session
        Base.metadata.create_all(engine)

        return session_local

    @classmethod
    def mock_generate_uuid(cls):
        cls.COUNT_UUID += 1
        return f'_created-0000-0000-0000-000mocked_{cls.COUNT_UUID:02d}'

    @classmethod
    def mock_now(cls):
        return cls._mock_date
