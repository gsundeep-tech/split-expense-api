import os


class ConfigManager:
    def __init__(self):
        self.runtime = os.environ.get('RUNTIME_ENV', 'local')

    def __get_db_uri(self):
        db_user = os.environ.get("DB_USER", "postgres")
        db_password = os.environ.get("DB_PASSWORD", "password")
        db_host = os.environ.get("DB_HOST", "localhost")
        db_port = os.environ.get("DB_PORT", 5432)
        db_name = os.environ.get("DB_NAME", "devdb")
        db_dialect_driver = os.environ.get("DB_DIALECT_DRIVER",
                                           "postgresql+psycopg2")

        __db_uri = '{db_dialect_driver}://' \
            '{db_user}:{pwd}@{host}:{port}/' \
            '{db_name}'.format(
                db_dialect_driver=db_dialect_driver,
                db_user=db_user,
                pwd=db_password,
                host=db_host,
                port=db_port,
                db_name=db_name
            )

        return __db_uri

    def get_db_uri(self):
        return self.__get_db_uri()

    def get_db_pool_size(self):
        return int(os.environ.get("DB_POOL_SIZE", 20))

    def get_db_schema(self):
        return os.environ.get("DB_SCHEMA", 'expense')
