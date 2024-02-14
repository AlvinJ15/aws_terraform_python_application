class SimulatedQuery:
    def __init__(self, data):
        self.data = data

    def filter_by(self, **kwargs):
        filtered_data = []
        for item in self.data:
            if all(getattr(item, key) == value for key, value in kwargs.items()):
                filtered_data.append(item)
        return SimulatedQuery(filtered_data)

    def all(self):
        return self.data

    def __iter__(self):
        return iter(self.data)

    def first(self):
        return self.data[0] if self.data else None
