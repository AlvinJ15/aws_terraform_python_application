import logging
import os
import traceback


# This should be placed just before the function, to capture the exceptions first
def handle_exceptions(func):
    def wrapper(*args, **kwargs):
        try:
            result = func(*args, **kwargs)
            return result
        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            logging.error(f"Error in {func.__name__}: {error_message}")
            logging.error(traceback.format_exc())
            result = {
                "statusCode": 500,
                'error_message': error_message
            }
            return result
    return wrapper


def add_cors_headers(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        cors_headers = {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
        }
        result['headers'] = cors_headers
        return result
    return wrapper


def set_stage(func):
    def wrapper(event, context):
        function_name = os.environ['AWS_LAMBDA_FUNCTION_NAME']
        stage = (function_name.split('-')[-1]).lower()
        return func(event, context, stage)
    return wrapper
