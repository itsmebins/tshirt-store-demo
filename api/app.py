from flask import Flask, jsonify
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})

    @app.get('/health')
    def health():
        return jsonify({'status': 'ok'}), 200

    return app


app = create_app()
