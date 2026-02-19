import os

from flask import Flask, jsonify
from flask_cors import CORS

PRODUCTS = {
    1: {
        'id': 1,
        'title': 'Classic Tee',
        'description': 'A clean, everyday t-shirt made from soft cotton with a relaxed fit for all-day comfort.',
        'price': 75.00,
        'imageURL': '/images/classic-tee.png',
        'sizeOptions': [
            {'label': 'S'},
            {'long': 'Medium'},
            {'label': 'L'},
        ],
    }
}


def create_app():
    app = Flask(__name__)
    client_origin = os.environ.get('CLIENT_ORIGIN', 'http://localhost:5173')
    CORS(app, resources={r"/*": {"origins": [client_origin]}})

    @app.get('/health')
    def health():
        return jsonify({'status': 'ok'}), 200

    @app.get('/product/<int:product_id>')
    def get_product(product_id):
        product = PRODUCTS.get(product_id)

        if product is None:
            return jsonify({'error': 'not_found'}), 404

        return jsonify(product), 200

    return app


app = create_app()
