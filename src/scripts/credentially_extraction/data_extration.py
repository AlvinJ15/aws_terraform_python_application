from scripts.credentially_extraction.credentially_api_request import CredentiallyRequest

if __name__ == "__main__":
    TOKEN = 'asdda'
    tollanis_training = CredentiallyRequest(TOKEN, app_name='tollanis-training', organization_id=2)
