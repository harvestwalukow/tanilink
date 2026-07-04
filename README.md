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

On Windows PowerShell, use the local helper script. It disables Docker
Compose's interactive console UI, builds the local images when needed, and
starts the stack detached:

```powershell
.\scripts\docker-up-local.ps1
```

Equivalent manual command:

```powershell
$env:COMPOSE_MENU="false"
$env:COMPOSE_PROGRESS="plain"
$env:CI="true"
docker compose --ansi never --progress plain up --build --pull never -d
```

Do not use `docker compose watch` for the first startup on Windows. It can fail
with `failed to get console: creating a console from a file is not supported on
windows`.

In local Docker, the frontend runs through Vite and the backend runs with
FastAPI reload. Normal code edits should refresh automatically; use `Ctrl+F5`
in the browser if Chrome keeps an old bundle cached.

After the first successful startup, you can start and stop the existing
containers without rebuilding:

```powershell
docker compose start
docker compose stop
```

Run `.\scripts\docker-up-local.ps1` again after dependency changes, `.env`
changes, Dockerfile/Compose changes, or if containers/images were removed.

Available local services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`
- Adminer: `http://localhost:8080`
- Mailcatcher: `http://localhost:1080`
- Traefik dashboard: `http://localhost:8090`

The first startup may take a minute while the database, backend setup, and frontend build finish.

### 3. Frontend-only local development

The Docker stack already runs Vite with hot refresh. If you prefer running Vite
directly on Windows instead:

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
