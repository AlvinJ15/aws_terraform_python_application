import traceback


def print_exception_stack():
    string_error = traceback.format_exc()
    print(string_error)
