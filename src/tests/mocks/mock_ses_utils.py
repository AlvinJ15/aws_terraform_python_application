
class MockSES:
    @classmethod
    def mock_send_email(cls, recipient, subject, body):
        return ''
