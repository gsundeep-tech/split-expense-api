from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy import MetaData

def get_metadata():
    metadata = MetaData(schema="expense")
    return metadata

def get_db_engine():
    __db_uri = '{dialect}+{driver}://{db_user}:{pwd}@{host}:{port}/{db_name}'.format(
        dialect='postgresql',
        driver='psycopg2',
        db_user='postgres',
        pwd='password',
        host='localhost',
        port='5432',
        db_name='devdb'
    )
    engine_uri = __db_uri
    pool_size = 20
    return create_engine(engine_uri, pool_size=pool_size)

Base = declarative_base()
db_engine = get_db_engine()
default_schema = 'expense'