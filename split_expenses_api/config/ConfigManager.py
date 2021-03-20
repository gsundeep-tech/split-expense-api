import os

class ConfigManager:
    def __init__(self):
        self.runtime = os.environ.get('runtime_env', 'local')
    
    def __db_uri(self):
        db_user = os.environ.get("db_user", "postgres")
        db_password = os.environ.get("db_password", "password")
        db_host = os.environ.get("db_host", "localhost")
        db_port = os.environ.get("db_port", 5432)
        db_name = os.environ.get("db_name", "devdb")
        db_dialect_driver = os.environ.get("db_dialect_driver", "postgresql+psycopg2")

        __db_uri = '{db_dialect_driver}://{db_user}:{pwd}@{host}:{port}/{db_name}'.format(
                db_dialect_driver=db_dialect_driver,
                db_user=db_user,
                pwd=db_password,
                host=db_host,
                port=db_port,
                db_name=db_name
                )
        
        return __db_uri

    def get_db_uri(self):
        return self.__db_uri()

    def get_db_pool_size(self):
        return int(os.environ.get("db_pool_size", 20))

    def get_db_schema(self):
        return os.environ.get("db_schema", 'expense')
