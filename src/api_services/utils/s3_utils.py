from boto3 import Session

session = Session()
s3_client = session.client("s3")

BUCKET_NAME = 'tollacred'


def upload_file_to_s3(path, file, content_type):
    try:
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=path,
            Body=file,
            ContentType=content_type
        )

        return path
    except Exception as e:
        print(f'Error uploading the Document: {e}')


def generate_file_link(path):
    # Get a temporal URL for download the object
    try:
        s3_object_url = s3_client.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': path
            }
         )
        return s3_object_url
    except Exception as e:
        print(f'Error uploading the Document: {e}')


def create_path_to_s3(path):
    try:
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=path,
        )
        return path
    except Exception as e:
        print(f'Error creating path in S3: {e}')

