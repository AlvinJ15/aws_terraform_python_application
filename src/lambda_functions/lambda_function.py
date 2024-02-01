import boto3


def lambda_handler(event, context):
    result = "Test Lambda Function Invoked\n"
    return {
        'statusCode': 200,
        'body': result
    }
