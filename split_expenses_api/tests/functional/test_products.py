import pytest

pytest.mark.usefixtures('test_client')
class TestProductsEndPoint:

    def test_get_all_products(self, test_client):
        user_url = self.urls['user']
        assert 1 == 1

    def test_create_product(self):
        assert True

    def test_get_product_by_id(self):
        pass

    def test_delete_product_by_id(self):
        pass