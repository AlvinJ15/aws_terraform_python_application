from boto3 import Session

session = Session()
s3_client = session.client("s3")


def upload_file_to_s3(bucket_name, path, file):
    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=path,
            Body=file,
        )

        # Get a temporal URL for download the object
        # s3_object_url = s3_client.generate_presigned_url(
        #    ClientMethod='get_object',
        #    Params={
        #        'Bucket': bucket_name,
        #        'Key': path
        #    }
        # )
        return path
    except Exception as e:
        print(e)
