
class DataBaseGateway:
    def __init__(self):
        # Assuming you have a way to initialize the actual database connection
        # (replace this with your specific implementation)
        self.query_string = None
        self.filter_args = None  # Dictionary to store filter arguments

    def query(self, model_class):
        """
        Starts building a query string based on the provided model class.

        Args:
            model_class (class): The SQLAlchemy model class for the query.

        Returns:
            DataBase: The current instance of DataBase for method chaining.
        """
        self.query_string = f"db.query({model_class.__name__})"
        return self

    def __getattr__(self, name):
        """
        Handles method calls after "query". Methods except "delete" are treated as string appending.

        Args:
            name (str): The method name called after "query".

        Returns:
            str: The updated query string.

        Raises:
            AttributeError: If the method is not supported.
        """
        if name == 'generate':
            return self._build_query()
        elif self.query_string is None:
            raise AttributeError(f"No query started. Call 'query(model_class)' first.")
        else:
            # print("Calling __getattr__: " + name)
            if name not in ['__len__', 'shape']:
                self.query_string += f".{name}("

            def wrapper(*args, **kwargs):
                # print('called with %r and %r' % (args, kwargs))
                query_string_part = f"{','.join(repr(arg) for arg in args)}"  # Handle methods with arguments
                if len(args) > 0:
                    query_string_part += ', '
                if kwargs:
                    query_string_part += f"{', '.join([f'{k}={repr(v)}' for k, v in kwargs.items()])}"
                self.query_string += query_string_part
                self.query_string += ')'
                return self

            return wrapper

    def _build_query(self):
        """
        Returns the complete delete query string.

        Returns:
            str: The final query string with the DELETE operation.
        """
        if self.query_string is None:
            raise AttributeError("No query started. Call 'query(model_class)' first.")
        return self.return_query

    def return_query(self):
        return self.query_string

