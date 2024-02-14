from sqlalchemy import Column, String, Enum

from data_models.models import Base, get_collation_ids

TYPE_VALUES = [
    'GP', 'Hospital', 'Private Company'
]
COUNTRY_VALUES = [
    'Australia', 'Belgium', 'Canada', 'Mexico', 'United Kingdom', 'United States'
]


class Organization(Base):
    __tablename__ = 'organizations'
    __table_args__ = {'extend_existing': True}

    id = Column(String(36, collation=get_collation_ids()), primary_key=True)
    type = Column(Enum(*TYPE_VALUES), nullable=False)
    name = Column(String(255), nullable=False)
    legal_name = Column(String(255), nullable=False)
    country = Column(Enum(*COUNTRY_VALUES), nullable=False)
    address1 = Column(String(255))
    address2 = Column(String(255))
    city = Column(String(255))
    state = Column(String(255))
    zip = Column(String(12))
