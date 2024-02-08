# TABLES CREATION

Steps for create and modify Tables using SQLAlchemy

## Requirements

``.env`` ENV file with environment variables with DB Credentials

mysql package for python dependency with SQLAlchemy

```sh
pip install mysqlclient
```

mysql package for python dependency with SQLAlchemy

```sh
pip install sqlalchemy
```

## Execution

Linux:

Set ENV variables from .env file

```sh
source DEV.env
```

For Create or Modify existing tables according to the `data_models` we run:
```sh
python3 models_execution.py
```
