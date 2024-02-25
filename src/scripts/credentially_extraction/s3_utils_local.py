import os

from boto3 import Session

session = Session()
s3_client = session.client(
    "s3",
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN'),
    region_name='us-east-1'
)


def upload_file_to_s3(path, file, bucket_name='tollacred'):
    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=path,
            Body=file,
        )
        return path
    except Exception as e:
        print(e)


def create_path_to_s3(path, bucket_name='tollacred'):
    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=path,
        )
        return path
    except Exception as e:
        print(e)
