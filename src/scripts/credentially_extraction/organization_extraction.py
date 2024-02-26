from scripts.credentially_extraction.credentially_extractor import CredentiallyExtractor

if __name__ == "__main__":
    TOKEN = 'qES031PWuohaqSc-cQL6CDdCVkI'
    APP_NAME = 'pulse'
    ORGANIZATION_ID = '5ac0097d-4c01-45b7-84f3-fc6cceb6869e'
    CRED_ORGANIZATION_ID = '4'
    extractor = CredentiallyExtractor(TOKEN, APP_NAME, ORGANIZATION_ID, CRED_ORGANIZATION_ID)
    extractor.begin_extraction()
