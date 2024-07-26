import boto3
import json

from botocore.exceptions import ClientError


def retrieve_credentials_Org(stage):
    secret_name = resolve_secret_name(stage)
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        # Get the secret value from Secrets Manager
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
        credential_values = json.loads(get_secret_value_response['SecretString'])

        return {
            'username': credential_values['username'],
            'password': credential_values['password'],
            'host': credential_values['host'],
            'port': credential_values['port'],
            'dbname': credential_values['dbname']
        }

    except ClientError as e:
        print(e.response)
        raise e


def retrieve_credentials_paperform():
    secret_name = "Paperform_access_token"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        # Get the secret value from Secrets Manager
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
        credential_values = json.loads(get_secret_value_response['SecretString'])

        return {
            'token': credential_values['API Token']
        }

    except ClientError as e:
        print(e.response)
        raise e


def retrieve_credentials_clicksend():
    secret_name = "click_send_credentials"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        # Get the secret value from Secrets Manager
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
        credential_values = json.loads(get_secret_value_response['SecretString'])
        return {
            'USERNAME': credential_values['USERNAME'],
            'API_KEY': credential_values['API_KEY'],
        }

    except ClientError as e:
        print(e.response)
        raise e


def resolve_secret_name(stage):
    if stage == 'prod':
        return 'Org_auto'
    elif stage == 'dev':
        return 'Organizationcred_auto_dev'
    elif stage == 'stage':
        return 'Organizationcred_auto_stage'
    else:
        raise Exception('Unknown stage {}'.format(stage))
