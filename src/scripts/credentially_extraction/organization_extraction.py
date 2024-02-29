from scripts.credentially_extraction.credentially_extractor import CredentiallyExtractor


def get_tollanis_training_creds():
    return {
        'TOKEN': 'xhKL6wmdDPrhNoJdrhwV1dtF7Qc',
        'APP_NAME': 'tollanis-training',
        'BUCKET_FOLDER_NAME': 'Tollanis-training',
        'CRED_ORGANIZATION_ID': '2'
    }


def get_genevive_creds():
    return {
        'TOKEN': 'fEdBB-5dR2avA1-5v6srYQ-4Gyg',
        'APP_NAME': 'genevive',
        'BUCKET_FOLDER_NAME': 'Genevive',
        'CRED_ORGANIZATION_ID': '10'
    }


def get_tollanis_payor_creds():
    return {
        'TOKEN': 'lS7toX4laqDklD52cbcaBVsgpdQ',
        'APP_NAME': 'tollanis-payor',
        'BUCKET_FOLDER_NAME': 'Tollanis-payor',
        'CRED_ORGANIZATION_ID': '12'
    }


def get_truecarenursing_creds():
    return {
        'TOKEN': 'ZyX79_oL-J3rf8Z0Y38KhplYRlQ',
        'APP_NAME': 'truecarenursing',
        'BUCKET_FOLDER_NAME': 'Truecarenursing',
        'CRED_ORGANIZATION_ID': '11'
    }


def get_elite365_creds():
    return {
        'TOKEN': 'kbuUdm4UVuXG5vr-am7c-b3Vl9I',
        'APP_NAME': 'elite365',
        'BUCKET_FOLDER_NAME': 'Elite365',
        'CRED_ORGANIZATION_ID': '7'
    }


#  Pulse not in secrets
def get_pulse_creds():
    return {
        'TOKEN': 'stCi6OTCM2Fo3OY7h8bFk0PUwf0',  ##### retrieve manually
        'APP_NAME': 'pulse',
        'BUCKET_FOLDER_NAME': 'Pulse',
        'CRED_ORGANIZATION_ID': '4'
    }


def get_elite365locums_creds():
    return {
        'TOKEN': '9jxora_h9DkHXH-I4ZkdRAxuiLc',
        'APP_NAME': 'elite365locums',
        'BUCKET_FOLDER_NAME': 'Elite365locums',
        'CRED_ORGANIZATION_ID': '13'
    }


if __name__ == "__main__":
    creds = get_elite365locums_creds()
    TOKEN = creds['TOKEN']
    APP_NAME = creds['APP_NAME']
    BUCKET_FOLDER_NAME = creds['BUCKET_FOLDER_NAME']
    CRED_ORGANIZATION_ID = creds['CRED_ORGANIZATION_ID']

    extractor = CredentiallyExtractor(TOKEN, APP_NAME, BUCKET_FOLDER_NAME, CRED_ORGANIZATION_ID)
    extractor.begin_extraction()


