# Tanilink

Tanilink is a full-stack web app built with FastAPI, PostgreSQL, React, and Vite. The current product includes an agricultural dashboard UI plus admin, auth, and item-management flows.

## Quickstart

### Requirements

- Docker Desktop with Docker Compose
- Bun
- uv

### 1. Set up environment variables

The live `.env` file is ignored so local secrets do not get committed.

If you need a fresh local config:

```bash
cp .env.example .env
```

Before sharing or deploying, update at least:

- `SECRET_KEY`
- `FIRST_SUPERUSER`
- `FIRST_SUPERUSER_PASSWORD`
- `POSTGRES_PASSWORD`

### 2. Start the stack

```bash
docker compose watch
```

Available local services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`
- Adminer: `http://localhost:8080`
- Mailcatcher: `http://localhost:1080`
- Traefik dashboard: `http://localhost:8090`

The first startup may take a minute while the database, backend setup, and frontend build finish.

### 3. Frontend-only local development

For faster frontend iteration, stop the frontend container and run Vite directly:

```bash
docker compose stop frontend
bun install
bun run dev
```

### 4. Backend-only local development

To run FastAPI outside Docker:

```bash
docker compose stop backend
cd backend
uv sync
uv run fastapi dev app/main.py
```

### 5. Common commands

Frontend:

```bash
bun run lint
bun run test
```

Backend:

```bash
docker compose exec backend bash scripts/tests-start.sh
```

Or directly from `backend/`:

```bash
cd backend
uv run pytest
```

## Project Structure

- `backend/` FastAPI app, models, migrations, and backend tests
- `frontend/` React app, routes, components, and Playwright tests
- `compose.yml` base service definitions
- `compose.override.yml` local development overrides

## More Docs

- [development.md](./development.md)
- [backend/README.md](./backend/README.md)
- [frontend/README.md](./frontend/README.md)
- [deployment.md](./deployment.md)
