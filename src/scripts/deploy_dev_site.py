from api_services.utils.s3_utils import upload_files


bucket_name = 'tollaniscred-devapp-content'
local_folder = '../../tollacred'

exclude_file = 'env_config.js'  # File to exclude

if __name__ == '__main__':
    upload_files(local_folder, bucket_name, exclude_file)
