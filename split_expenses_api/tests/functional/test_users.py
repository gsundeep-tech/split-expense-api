import pytest


@pytest.mark.usefixtures('test_client')
class TestUsersEndpoint:

    def test_1_get_all_users(self, test_client):
        user_url = self.urls['user']
        response = test_client.get(user_url)
        assert response.status_code == 200

    def test_2_create_user(self, test_client):
        user_url = self.urls['user']
        data = {
            "user_name": "user1",
            "phone_number": 9876543210,
            "email": "hello@split-expense.com"
        }
        response = test_client.post(user_url, data=data)
        assert response.status_code == 201

    def test_3_get_user_by_id(self, test_client):
        user_url = self.urls['user']
        user_id = '1'
        url = '/'.join([user_url, user_id])
        response = test_client.get(url)
        assert response.status_code == 200

    # def test_4_delete_user_by_id(self, test_client):
    #     user_url = self.urls['user']
    #     user_id = '9990000'
    #     url = '/'.join([user_url, user_id])
    #     response = test_client.delete(url)
    #     assert response.status_code == 404
