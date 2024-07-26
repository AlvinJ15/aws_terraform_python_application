from concurrent.futures import ThreadPoolExecutor

from scripts.credentially_extraction.credentially_extractor import CredentiallyExtractor


def get_Organization_training_creds():
    return {
        'TOKEN': 'UEfPylkw8DLCzeSMuTexuWoGLsM',
        'APP_NAME': 'Organization-training',
        'BUCKET_FOLDER_NAME': 'Organization-training',
        'CRED_ORGANIZATION_ID': '2'
    }


def get_genevive_creds():
    return {
        'TOKEN': 'tjD_SefDOX9l0QbkvmktI7k21vA',
        'APP_NAME': 'genevive',
        'BUCKET_FOLDER_NAME': 'Genevive',
        'CRED_ORGANIZATION_ID': '10'
    }


def get_Organization_payor_creds():
    return {
        'TOKEN': '7toK0AfveRWqBxKJJcjKxm494Vc',
        'APP_NAME': 'Organization-payor',
        'BUCKET_FOLDER_NAME': 'Organization-payor',
        'CRED_ORGANIZATION_ID': '12'
    }


def get_truecarenursing_creds():
    return {
        'TOKEN': 'SeKAUvxyujF-PLxkZ1ymLQa8LI0',
        'APP_NAME': 'truecarenursing',
        'BUCKET_FOLDER_NAME': 'Truecarenursing',
        'CRED_ORGANIZATION_ID': '11'
    }


def get_elite365_creds():
    return {
        'TOKEN': 'VnvYIn3YeJIf22NatX5IcZl4yL8',
        'APP_NAME': 'elite365',
        'BUCKET_FOLDER_NAME': 'Elite365',
        'CRED_ORGANIZATION_ID': '7'
    }


#  Pulse not in secrets
def get_pulse_creds():
    return {
        'TOKEN': 'YBoey_YFvzPnFfDap0nJg-fAdzo',  ##### retrieve manually
        'APP_NAME': 'pulse',
        'BUCKET_FOLDER_NAME': 'Pulse',
        'CRED_ORGANIZATION_ID': '4'
    }


def get_elite365locums_creds():
    return {
        'TOKEN': 'jhBnoAUaRrZitMeyvnDB0wyi6sw',
        'APP_NAME': 'elite365locums',
        'BUCKET_FOLDER_NAME': 'Elite365-Locums',
        'CRED_ORGANIZATION_ID': '13'
    }


def paralel_upload(creds):
    TOKEN = creds['TOKEN']
    APP_NAME = creds['APP_NAME']
    BUCKET_FOLDER_NAME = creds['BUCKET_FOLDER_NAME']
    CRED_ORGANIZATION_ID = creds['CRED_ORGANIZATION_ID']

    extractor = CredentiallyExtractor(TOKEN, APP_NAME, BUCKET_FOLDER_NAME, CRED_ORGANIZATION_ID)
    extractor.begin_extraction()

if __name__ == "__main__":
    creds = get_elite365locums_creds()

    with ThreadPoolExecutor(max_workers=20) as executor:
        executor.submit(paralel_upload, get_Organization_training_creds())
        executor.submit(paralel_upload, get_genevive_creds())
        executor.submit(paralel_upload, get_Organization_payor_creds())
        executor.submit(paralel_upload, get_truecarenursing_creds())
        executor.submit(paralel_upload, get_elite365_creds())
        executor.submit(paralel_upload, get_pulse_creds())
        executor.submit(paralel_upload, get_elite365locums_creds())
        executor.shutdown(wait=True)

