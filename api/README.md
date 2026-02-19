# API

Flask API for the tshirt-store demo.

## Setup

1. Create a virtual environment:
   ```bash
   python3 -m venv .venv
   ```
2. Activate it:
   ```bash
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Run

1. Set the Flask app module:
   ```bash
   export FLASK_APP=app.py
   ```
2. Start the server on port 5000:
   ```bash
   flask run --port 5000
   ```

## Endpoint

- `GET /health` returns:
  ```json
  {"status":"ok"}
  ```
