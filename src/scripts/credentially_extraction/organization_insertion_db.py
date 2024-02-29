from concurrent.futures import ThreadPoolExecutor

from scripts.credentially_extraction.credentially_database_insertion import CredentiallyDatabaseInsertion
from scripts.credentially_extraction.credentially_extractor import CredentiallyExtractor


def get_tollanis_training_creds():
    return {
        'TOKEN': 'xhKL6wmdDPrhNoJdrhwV1dtF7Qc',
        'APP_NAME': 'tollanis-training',
        'BUCKET_FOLDER_NAME': 'Tollanis-training',
        'CRED_ORGANIZATION_ID': '2',
        'ORGANIZATION_ID': 'e5a88912-a95b-47a8-9a2f-f0f0594c7a3b'
    }


def get_genevive_creds():
    return {
        'TOKEN': 'fEdBB-5dR2avA1-5v6srYQ-4Gyg',
        'APP_NAME': 'genevive',
        'BUCKET_FOLDER_NAME': 'Genevive',
        'CRED_ORGANIZATION_ID': '10',
        'ORGANIZATION_ID': '5d552a6c-1bef-412f-a913-36c2326975a3'
    }


def get_tollanis_payor_creds():
    return {
        'TOKEN': 'lS7toX4laqDklD52cbcaBVsgpdQ',
        'APP_NAME': 'tollanis-payor',
        'BUCKET_FOLDER_NAME': 'Tollanis-payor',
        'CRED_ORGANIZATION_ID': '12',
        'ORGANIZATION_ID': '0c53f3f8-5088-444a-a9e2-2c773a20fe6f'
    }


def get_truecarenursing_creds():
    return {
        'TOKEN': 'ZyX79_oL-J3rf8Z0Y38KhplYRlQ',
        'APP_NAME': 'truecarenursing',
        'BUCKET_FOLDER_NAME': 'Truecarenursing',
        'CRED_ORGANIZATION_ID': '11',
        'ORGANIZATION_ID': '4c6e19a0-0a58-43f0-a12e-9d66eabe2265'
    }


def get_elite365_creds():
    return {
        'TOKEN': 'kbuUdm4UVuXG5vr-am7c-b3Vl9I',
        'APP_NAME': 'elite365',
        'BUCKET_FOLDER_NAME': 'Elite365',
        'CRED_ORGANIZATION_ID': '7',
        'ORGANIZATION_ID': '9cf728c0-288a-4d92-9524-04d58b2ab32d'
    }


#  Pulse not in secrets
def get_pulse_creds():
    return {
        'TOKEN': 'stCi6OTCM2Fo3OY7h8bFk0PUwf0',  ##### retrieve manually
        'APP_NAME': 'pulse',
        'BUCKET_FOLDER_NAME': 'Pulse',
        'CRED_ORGANIZATION_ID': '4',
        'ORGANIZATION_ID': 'aed47a1f-0ab4-44be-a903-2fb3ca783980'
    }


def get_elite365locums_creds():
    return {
        'TOKEN': '9jxora_h9DkHXH-I4ZkdRAxuiLc',
        'APP_NAME': 'elite365locums',
        'BUCKET_FOLDER_NAME': 'Elite365locums',
        'CRED_ORGANIZATION_ID': '13',
        'ORGANIZATION_ID': '2c8d5c83-eac7-4ec2-bb57-ca2631d5f0ae'
    }


def insert_organization(creds):
    TOKEN = creds['TOKEN']
    APP_NAME = creds['APP_NAME']
    BUCKET_FOLDER_NAME = creds['BUCKET_FOLDER_NAME']
    CRED_ORGANIZATION_ID = creds['CRED_ORGANIZATION_ID']
    ORGANIZATION_ID = creds['ORGANIZATION_ID']

    extractor = CredentiallyDatabaseInsertion(TOKEN, APP_NAME, BUCKET_FOLDER_NAME, ORGANIZATION_ID, CRED_ORGANIZATION_ID)
    extractor.begin_extraction()


if __name__ == "__main__":
    #insert_organization(get_tollanis_training_creds())
    #insert_organization(get_genevive_creds())
    #insert_organization(get_tollanis_payor_creds())
    #insert_organization(get_truecarenursing_creds())
    #insert_organization(get_elite365_creds())
    #insert_organization(get_elite365locums_creds())
    insert_organization(get_pulse_creds())
