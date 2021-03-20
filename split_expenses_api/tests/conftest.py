import os
import pytest
from sqlalchemy.schema import DropSchema

from split_expenses_api.api.app import create_app
from split_expenses_api.api.database import get_db_engine


resources_path = os.path.dirname(__file__) + '/resources'


@pytest.fixture(scope='class')
def test_client(request):

    # Setup
    api_prefix = '/api/'
    _urls = {
        'user': api_prefix + 'user',
        'product': api_prefix + 'product'
    }

    request.cls.resources_path = resources_path
    request.cls.urls = _urls
    os.environ['db_schema'] = 'test_expense'

    app = create_app()
    testing_client = app.test_client()

    yield testing_client

    # Teardown
    engine = get_db_engine()
    try:
        with engine.begin():
            engine.execute(DropSchema('test_expense', cascade=True))
            del os.environ['db_schema']
    except Exception as ex:
        print("Test Schema Deleted")

