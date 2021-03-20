from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy import MetaData

from split_expenses_api.config.ConfigManager import ConfigManager

cfgManager = ConfigManager()


def get_metadata():
    default_schema = get_default_schema()
    metadata = MetaData(schema=default_schema)
    return metadata

def get_db_engine():
    engine_uri = cfgManager.get_db_uri()
    pool_size = cfgManager.get_db_pool_size()
    return create_engine(engine_uri, pool_size=pool_size)

def get_default_schema():
    return cfgManager.get_db_schema()

Base = declarative_base()
db_engine = get_db_engine()
