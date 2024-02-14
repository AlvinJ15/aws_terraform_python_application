import os


def mock_retrieve_credentials():
    # Return values from .env as before
    return {
        "username": os.environ.get("DB_USERNAME"),
        "password": os.environ.get("DB_PASSWORD"),
        "host": os.environ.get("DB_HOST"),
        "port": os.environ.get("DB_PORT"),
        "dbname": os.environ.get("DB_NAME"),
    }
