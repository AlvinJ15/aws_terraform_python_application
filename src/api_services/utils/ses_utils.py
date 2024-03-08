import urllib

import boto3

ses_client = boto3.client('ses')
SENDER_REFEVALS = 'refevals@tollaniscred.com'
SENDER_CREDENTIALLY = 'credentialing@tollanis.com '


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
    def send_email(cls, recipient, subject, body, sender):
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
            Source=sender,
        )
        print(f'EMAIL response: ${response}')
        return response

    @classmethod
    def send_email_refevals(cls, recipient, subject, body):
        cls.send_email(recipient, subject, body, SENDER_REFEVALS)

    @classmethod
    def send_email_credentially(cls, recipient, subject, body):
        cls.send_email(recipient, subject, body, SENDER_CREDENTIALLY)
