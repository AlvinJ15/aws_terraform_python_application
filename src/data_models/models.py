from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


def update_object_from_dict(data_model, data):
    for key, value in data.items():
        if hasattr(data_model, key):  # Check if attribute exists
            setattr(data_model, key, value)
        else:
            print(f"Warning: Attribute '{key}' does not exist on model '{type(data_model).__name__}'")
