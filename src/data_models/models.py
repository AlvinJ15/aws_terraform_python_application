import datetime

from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


def update_object_from_dict(data_model, data):
    for key, value in data.items():
        if hasattr(data_model, key):  # Check if attribute exists
            setattr(data_model, key, value)
        else:
            print(f"Warning: Attribute '{key}' does not exist on model '{type(data_model).__name__}'")
    return data_model


def set_fields_from_dict(data_model, data, date_fields):
    for key, value in data.items():
        if key in date_fields:
            # Parse value as datetime if the key is "date_fields" list
            value = datetime.datetime.strptime(value, "%Y-%m-%d %H:%M:%S")  # Adjust format if needed
        setattr(data_model, key, value)


def get_collation_ids():
    return "utf8mb4_unicode_ci"


def get_tinyint_class():
    return TINYINT
