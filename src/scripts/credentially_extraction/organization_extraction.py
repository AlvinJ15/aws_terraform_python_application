from scripts.credentially_extraction.credentially_extractor import CredentiallyExtractor

if __name__ == "__main__":
    TOKEN = 'TWm0TOQ_Ox8Gs32VaWZGo6HzCwk'
    APP_NAME = 'tollanis-training'
    ORGANIZATION_ID = '30728ee5-5908-451a-83a5-1c301c93e3f1'
    CRED_ORGANIZATION_ID = '2'
    extractor = CredentiallyExtractor(TOKEN, APP_NAME, ORGANIZATION_ID, CRED_ORGANIZATION_ID)
    extractor.begin_extraction()
