import os

import boto3
from boto3 import Session
from boto3 import resource
import mimetypes

from botocore.config import Config
from botocore.exceptions import ClientError

session = Session()
s3_client = session.client("s3")
# s3_client = session.client("s3", config=Config(signature_version='v4'))

BUCKET_NAME = 'tollacred'
s3 = boto3.client('s3')


def upload_files(local_folder, bucket_name, exclude_file=None):
    """Uploads all files in a local folder to an S3 bucket, excluding a specific file."""
    for root, _, files in os.walk(local_folder):
        for filename in files:
            file_path = os.path.join(root, filename)
            relative_path = os.path.relpath(file_path, local_folder)  # Get relative path for S3

            if exclude_file and exclude_file in relative_path:
                print(f"Skipping excluded file: {file_path}")
                continue

            mime_type = mimetypes.guess_type(file_path)
            s3_client.upload_file(file_path, bucket_name, relative_path,
                                  ExtraArgs={'ContentType': mime_type[0] if mime_type[0] else ""})
            print(f"Uploaded: {relative_path}")


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


def generate_file_link(path, client_method='get_object', content_type='text/plain'):
    params = {
        'Bucket': BUCKET_NAME,
        'Key': path,
    }
    if client_method == 'put_object':
        params['ContentType'] = content_type

    # For enable tags, sent header 'x-amz-tagging' on client upload
    params['Tagging'] = ''

    # Get a temporal URL for download the object
    try:
        s3_object_url = s3_client.generate_presigned_url(
            ClientMethod=client_method,
            Params=params
        )
        return s3_object_url
    except Exception as e:
        print(f'Error Obtaining the Document: {e}')


def create_path_to_s3(path):
    try:
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=path,
        )
        return path
    except Exception as e:
        print(f'Error creating path in S3: {e}')


def change_object_name(object_key, new_object_key):
    s3.copy_object(Bucket=BUCKET_NAME, CopySource={'Bucket': BUCKET_NAME, 'Key': object_key}, Key=new_object_key)
    s3.delete_object(Bucket=BUCKET_NAME, Key=object_key)


def delete_file_from_s3(path):
    try:
        s3_client.delete_object(
            Bucket=BUCKET_NAME,
            Key=path,
        )
        print(f'File {path} deleted successfully from S3')
    except Exception as e:
        print(f'Error deleting file from S3: {e}')


def delete_entire_folder(path):
    s3 = resource('s3')
    bucket = s3.Bucket(BUCKET_NAME)
    objects_to_delete = []
    for obj in bucket.objects.filter(Prefix=path):
        objects_to_delete.append({'Key': obj.key})
    if objects_to_delete:
        bucket.delete_objects(
            Delete={
                'Objects': objects_to_delete
            }
        )


def list_files_from_path(path: str):
    child_objects = get_child_folders(path)
    if child_objects:
        print(f"Information for objects within path '{path}':")
        print("CHILD OBJECTS: ", child_objects)
    return child_objects


def is_folder(object_key):
    return object_key.endswith('/')


def get_child_folders(parent_path):
    try:
        # List objects with delimiter to identify folders (avoid listing objects within folders)
        response_folders = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=parent_path, Delimiter='/', FetchOwner=True)

        # Extract child folder prefixes
        child_folders = [
            {
                "object_key": prefix['Prefix'],
                "modification_date": '-',
                "size": "-",  # Size not available for folders
                "type": "folder",
                "owner": "-",
             }
            for prefix in response_folders.get('CommonPrefixes', [])
        ]

        child_files = [get_file_info(object_key) for object_key in response_folders.get('Contents', []) if object_key['Key'][-1] != '/' ]

        return child_folders + child_files

    except ClientError as e:
        print(f"Error getting child folders for path '{parent_path}': {e}")
        return []


def get_file_info(object_info):
    tagging_response = s3.get_object_tagging(
        Bucket=BUCKET_NAME,
        Key=object_info.get('Key')
    )
    tags = {tag['Key']: tag['Value'] for tag in tagging_response.get('TagSet', [])}
    object_date = object_info['LastModified']
    object_size = object_info['Size']
    formatted_date = object_date.strftime('%Y-%m-%d %H:%M:%S')
    return {
        "object_key": object_info.get('Key'),
        "modification_date": formatted_date,
        "size": object_size,  # Size not available for folders
        "type": "file",
        "owner": object_info.get('Owner', {}).get('DisplayName'),
        "tags": tags
    }

def get_child_objects(parent_path):
    try:
        # List objects with no delimiter to get all objects directly under the path
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=parent_path)

        objects = response.get('Contents', [])
        return objects

    except ClientError as e:
        print(f"Error getting child objects for path '{parent_path}': {e}")
        return []


def get_folder_info(parent_path):
    """
    Retrieves information for all child folders and files directly under
    the specified path, excluding sub-folders and sub-files.
    """
    info = []

    # Get child objects (folders and files) directly under the path
    child_objects = get_child_objects(parent_path)

    # Separate child folders and files
    child_folders = [obj['Key'] for obj in child_objects if is_folder(obj['Key'])]
    child_files = [obj['Key'] for obj in child_objects if not is_folder(obj['Key'])]

    # Add information for child folders
    for folder in child_folders:
        folder_info = get_file_info(folder)
        if folder_info:
            info.append(folder_info)

    # Add information for child files
    for file in child_files:
        file_info = get_file_info(file)
        if file_info:
            info.append(file_info)

    return info
