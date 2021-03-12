from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy import MetaData

from split_expenses_api.config.ConfigManager import ConfigManager

def get_metadata():
    metadata = MetaData(schema="expense")
    return metadata

def get_db_engine():
    cfgManager = ConfigManager()
    engine_uri = cfgManager.get_db_uri()
    pool_size = cfgManager.get_db_pool_size()
    return create_engine(engine_uri, pool_size=pool_size)

Base = declarative_base()
db_engine = get_db_engine()
default_schema = 'expense'