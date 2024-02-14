def get_file_content(filename):
    with open(filename, "r") as f:
        content = f.read()
    return content
