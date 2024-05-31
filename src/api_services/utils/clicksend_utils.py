from __future__ import print_function

import clicksend_client
from clicksend_client import SmsMessage

from api_services.utils.credentials_utils import retrieve_credentials_clicksend


class ClickSend:
    _credentials = None  # Class-level attribute for singleton
    _configuration = None

    @classmethod
    def get_credentials(cls):
        if not cls._credentials:
            try:
                cls._credentials = retrieve_credentials_clicksend()  # Initialize singleton
            except Exception as e:
                print(e)
        return cls._credentials

    @classmethod
    def get_configuration(cls):
        if not cls._configuration:
            try:
                cls._configuration = clicksend_client.Configuration()
                cls._configuration.username = cls.get_credentials()['USERNAME']
                cls._configuration.password = cls.get_credentials()['API_KEY']
            except Exception as e:
                print(e)
        return cls._configuration

    @classmethod
    def send_sms(cls, sms_content, from_number, to_number, custom_string):
        # Configure HTTP basic authorization: BasicAuth
        configuration = ClickSend.get_configuration()

        # create an instance of the API class
        api_instance = clicksend_client.SMSApi(clicksend_client.ApiClient(configuration))

        # If you want to explicitly set from, add the key _from to the message.
        sms_message = SmsMessage(
            source="php",
            body=sms_content,
            _from=from_number,
            to=to_number,
            custom_string=custom_string
        )

        sms_messages = clicksend_client.SmsMessageCollection(messages=[sms_message])

        # Send sms message(s)
        api_response = api_instance.sms_send_post(sms_messages)
        print(api_response)
