import pytest

pytest.mark.usefixtures('test_client')
class TestProductsEndPoint:

    def test_1_get_all_products(self, test_client):
        product_url = self.urls['product']
        response = test_client.get(product_url)
        assert response.status_code == 200

    def test_2_create_product(self, test_client):
        product_url = self.urls['product']
        data = {
            "product_name": "test1",
            "price": 2,
            "quantity": 1
        }
        response = test_client.post(product_url, data=data)
        assert response.status_code == 201
        assert response.json == 'product test1 saved successfully'

    def test_3_get_product_by_id(self, test_client):
        product_url = self.urls['product']
        product_id = '1'
        url = '/'.join([product_url, product_id])
        response = test_client.get(url)
        assert response.status_code == 200

    def test_4_delete_product_by_id(self, test_client):
        product_url = self.urls['product']
        product_id = '999'
        url = '/'.join([product_url, product_id])
        response = test_client.delete(url)
        assert response.status_code == 404
