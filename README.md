# tshirt-store-demo

Client built with Vite React TS, API will be added in /api.

## Run With Docker Compose

From the repository root:

```bash
docker compose up --build
```

Services:

- Client: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:5001](http://localhost:5001)

The compose setup configures:
- `VITE_API_BASE_URL=http://localhost:${API_HOST_PORT}`
- API CORS origin as `http://localhost:${CLIENT_HOST_PORT}`

If you need different host ports:

```bash
API_HOST_PORT=5002 CLIENT_HOST_PORT=5174 docker compose up --build
```

## E2E Tests (Playwright)

From three terminals:

1. Start API:
```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
FLASK_APP=app.py flask run --port 5000
```

2. Start client:
```bash
cd client
npm install
VITE_API_BASE_URL=http://localhost:5000 npm run dev -- --host 0.0.0.0 --port 5173
```

3. Run E2E tests:
```bash
cd client
npx playwright install chromium
npm run test:e2e
```

Optional: one command (starts API + client + tests) using `npx concurrently` and `npx wait-on`:

```bash
npx concurrently -k -s first -n api,client,test "cd api && FLASK_APP=app.py flask run --port 5000" "cd client && VITE_API_BASE_URL=http://localhost:5000 npm run dev -- --host 0.0.0.0 --port 5173" "cd client && npx wait-on http://localhost:5000/health http://localhost:5173 && npm run test:e2e"
```

Playwright config supports overriding API target with:

```bash
E2E_API_BASE_URL=http://localhost:5002 E2E_MANAGED_CLIENT=1 npm run test:e2e
```

You can also override client target/port when needed:

```bash
E2E_BASE_URL=http://localhost:5174 E2E_CLIENT_PORT=5174 npm run test:e2e
```
