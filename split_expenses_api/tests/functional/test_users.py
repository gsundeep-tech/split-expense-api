import pytest

@pytest.mark.usefixtures('test_client')
class TestUsersEndpoint:

    def test_get_all_users(self):
        pass

    def test_create_user(self):
        pass

    def test_get_user_by_id(self):
        pass

    def test_delete_user_by_id(self):
        pass