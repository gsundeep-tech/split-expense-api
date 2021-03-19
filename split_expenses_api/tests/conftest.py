import os
import pytest

from split_expenses_api.api.app import create_app


resources_path = os.path.dirname(__file__) + '/resources'


@pytest.fixture(scope='class')
def test_client(request):

    api_prefix = '/api/'
    _urls = {
        'user': api_prefix + 'user',
        'product': api_prefix + 'product'
    }

    request.cls.resources_path = resources_path
    request.cls.urls = _urls

    app = create_app()
    testing_client = app.test_client()
    yield testing_client
