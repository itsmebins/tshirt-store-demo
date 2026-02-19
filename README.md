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
