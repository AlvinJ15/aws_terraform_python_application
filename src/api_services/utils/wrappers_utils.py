def set_stage(func):
    def wrapper(event, context):
        stage = event.get('requestContext', {}).get('stage')
        return func(event, context, stage)
    return wrapper
