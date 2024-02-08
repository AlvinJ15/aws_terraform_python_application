import boto3
import json

from botocore.exceptions import ClientError


def retrieve_credentials():
    secret_name = "tollacred_auto"
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
