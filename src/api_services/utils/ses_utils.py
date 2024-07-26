import urllib
import boto3

from botocore.exceptions import ClientError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

ses_client = boto3.client('ses')
SENDER_REFEVALS = 'refevals@Organizationcred.com'
SENDER_CREDENTIALLY = 'automation@Organizationcred.com'
SENDER_NOTIFICATION = 'notifications@Organizationcred.com'
DEFAULT_CC = 'shubham.aggarwal@Organization.com'
CHARSET = "utf-8"


def urlencode_dict(data):
    """
    Converts a dictionary of key-value pairs to URL-encoded query parameters.
    """
    params = []
    for key, value in data.items():
        params.append(f"{key}={urllib.parse.quote(str(value))}")
    return "&".join(params)


class SES:
    @classmethod
    def send_email(cls, recipient, subject, body, sender, cc=DEFAULT_CC):
        BODY_HTML = f'<html><head></head><body>{body}</body></html>'
        response = ses_client.send_email(
            Destination={
                'ToAddresses': [
                    recipient,
                ],
                'CcAddresses': [cc] if cc else []
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': BODY_HTML,
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': subject,
                }
            },
            Source=sender,
        )
        print(f'EMAIL response: ${response}')
        return response

    @classmethod
    def send_email_with_attachment(cls, recipient, subject, body, sender, file_bytes, filename, cc=DEFAULT_CC):
        msg = MIMEMultipart('mixed')
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] = recipient
        msg['cc'] = cc

        msg_body = MIMEMultipart('alternative')

        # Encode the text and HTML content and set the character encoding. This step is
        # necessary if you're sending a message with characters outside the ASCII range.
        #textpart = MIMEText(BODY_TEXT.encode(CHARSET), 'plain', CHARSET)
        htmlpart = MIMEText(body.encode(CHARSET), 'html', CHARSET)

        # Add the text and HTML parts to the child container.
        #msg_body.attach(textpart)
        msg_body.attach(htmlpart)

        # Define the attachment part and encode it using MIMEApplication.
        att = MIMEApplication(file_bytes)

        # Add a header to tell the email client to treat this part as an attachment,
        # and to give the attachment a name.
        att.add_header('Content-Disposition','attachment', filename=filename)

        # Attach the multipart/alternative child container to the multipart/mixed
        # parent container.
        msg.attach(msg_body)

        # Add the attachment to the parent container.
        msg.attach(att)
        try:
            response = ses_client.send_raw_email(
                Source=sender,
                Destinations=[
                    recipient,
                    cc
                ],
                RawMessage={
                    'Data': msg.as_string(),
                },
            )
        except ClientError as e:
            print(e.response['Error']['Message'])
        else:
            print("Email sent! Message ID:"),
            print(response['MessageId'])

    @classmethod
    def send_email_refevals(cls, recipient, subject, body):
        cls.send_email(recipient, subject, body, SENDER_REFEVALS)

    @classmethod
    def send_notification_email(cls, recipient, subject, body):
        cls.send_email(recipient, subject, body, SENDER_NOTIFICATION, cc=None)

    @classmethod
    def send_email_credentially(cls, recipient, subject, body, file=None, filename=None):
        if file:
            cls.send_email_with_attachment(recipient, subject, body, SENDER_CREDENTIALLY, file, filename)
        else:
            cls.send_email(recipient, subject, body, SENDER_CREDENTIALLY)
