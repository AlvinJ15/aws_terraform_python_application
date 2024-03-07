import urllib

import boto3

ses_client = boto3.client('ses')
#SENDER = 'refevals@tollaniscred.com'
SENDER = 'credentialing@tollanis.com '


def urlencode_dict(data):
  """
  Converts a dictionary of key-value pairs to URL-encoded query parameters.
  """
  params = []
  for key, value in data.items():
    params.append(f"{key}={urllib.parse.quote(str(value))}")
  return "&".join(params)


class SES():
    @classmethod
    def send_email(cls, recipient, subject, body):
        response = ses_client.send_email(
            Destination={
                'ToAddresses': [
                    recipient,
                ],
            },
            Message={
                'Body': {
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': body,
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': subject,
                },
            },
            Source=SENDER,
        )
        print(f'EMAIL response: ${response}')
        return response
