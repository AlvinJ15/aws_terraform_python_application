# Terraform
> Steps for use terraform and deploy the project

One to two paragraph statement about your product and what it does.

## Requirements
``1.5.5`` Terraform Version

``*.env`` ENV file with environment variables

## Deployment

Linux:

```sh
source DEV.env
```

```sh
terraform init
```

```sh
terraform apply
```

## TESTING

### Testing and API endpoint using Authentication Token (Terminal)

Initialize `.env` file for export credentials

```sh
source DEV.env
```

Login to Hosted UI (Login page of AWS cognito) and copy the `code` output and set is as variable in bash

```sh
CODE=<code>
```

Invoke Cognito token exchange (`CLIENT_ID` is obtained from App Client in the Cognito Pool)

```sh
curl -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "Authorization: Basic ${ENCODED_CREDENTIALS}" \
    -d "grant_type=authorization_code&client_id=${CLIENT_ID}&code=${CODE}&redirect_uri=https://aqqakr76zbjxtqxw36d2fjluue0vkpkz.lambda-url.us-east-1.on.aws/" \
    "${COGNITO_DOMAIN}/oauth2/token"
```

from the Json response copy the `id_token` and set it as variable in bash

```sh
TOKEN=<id_token>
```

Then invoke the api services (API_URL should be endpoint of our API GATEWAY obtained from AWS)

```sh
curl -H "Authorization: ${TOKEN}" https://${API_URL}/dev/organizations/3f4eccd2-c57d-11ee-8592-127af369fb07/roles
```

### Testing and API endpoint (AWS Api Gateway Console)

Go to API Gateway and select the resources to test
In the Test tab, we can send a request body, with valid `role_id` and `organization_id`, for example:

```json
{
  "role_id": "98765432-1234-5678-90ab-cdef01234567",
  "organization_id": "3f4eccd2-c57d-11ee-8592-127af369fb07",
  "name": "Registered Nurse",
  "description": "Provides direct patient care, administers medications, and monitors patient health.",
  "type": "Clinical"
}
```