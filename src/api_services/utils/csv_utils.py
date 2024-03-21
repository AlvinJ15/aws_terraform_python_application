import csv
import io


def create_csv_in_memory(headers, rows):
    """
    Creates a CSV file in memory, adds headers and rows, and returns the bytes.

    Args:
        headers (list): List of strings representing the CSV headers.
        rows (list): List of lists representing the CSV data.
                    Each inner list represents a row.

    Returns:
        bytes: The CSV content as bytes.
    """

    # Create a StringIO object to act as an in-memory file
    csv_buffer = io.StringIO()
    writer = csv.writer(csv_buffer)

    # Write headers
    writer.writerow(headers)

    # Write data rows
    writer.writerows(rows)

    # Get the CSV content as bytes
    csv_bytes = csv_buffer.getvalue().encode('utf-8')

    return csv_bytes
