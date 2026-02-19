import pytest

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config.update(TESTING=True)

    with app.test_client() as test_client:
        yield test_client


def test_product_1_returns_200_and_required_keys(client):
    response = client.get('/product/1')

    assert response.status_code == 200

    payload = response.get_json()
    required_keys = {'id', 'title', 'description', 'price', 'imageURL', 'sizeOptions'}

    assert required_keys.issubset(payload.keys())
    assert payload['id'] == 1
    assert payload['title'] == 'Classic Tee'
    assert payload['price'] == 75.0
    assert any('label' in option for option in payload['sizeOptions'])
    assert any('long' in option for option in payload['sizeOptions'])


def test_product_999_returns_404(client):
    response = client.get('/product/999')

    assert response.status_code == 404
    assert response.get_json() == {'error': 'not_found'}
