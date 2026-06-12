# Deploy TaniLink to Render

This repo can be deployed to Render with:

- 1 PostgreSQL database
- 1 backend web service from [backend/Dockerfile](/D:/CODE/tanilink/backend/Dockerfile)
- 1 frontend web service from [frontend/Dockerfile](/D:/CODE/tanilink/frontend/Dockerfile)

The configuration is already prepared in [render.yaml](/D:/CODE/tanilink/render.yaml).

## What gets created

- `tanilink-db`
- `tanilink-api`
- `tanilink-web`

## Before you deploy

1. Push the repo to GitHub.
2. Make sure Render can access that GitHub repo.
3. Decide whether you want to keep the default Render names from `render.yaml` or rename them in the Render dashboard after the first deploy.

## Deploy steps

1. In Render, click `New +`.
2. Choose `Blueprint`.
3. Connect the GitHub repo `harvestwalukow/tanilink`.
4. Render will detect [render.yaml](/D:/CODE/tanilink/render.yaml).
5. Review the resources and create them.

## Important environment values

The backend needs these to be correct in production:

- `ENVIRONMENT=production`
- `FRONTEND_HOST=https://<your-frontend>.onrender.com`
- `BACKEND_CORS_ORIGINS=https://<your-frontend>.onrender.com`
- `POSTGRES_*` values come from the Render Postgres database

The frontend needs:

- `VITE_API_URL=https://<your-backend>.onrender.com`

## After the first deploy

Update these values in Render so they match the real service URLs:

For `tanilink-api`:

- `DOMAIN=https://<your-backend>.onrender.com` is not required by routing, but keep the hostname value aligned if you use it elsewhere
- `FRONTEND_HOST=https://<your-frontend>.onrender.com`
- `BACKEND_CORS_ORIGINS=https://<your-frontend>.onrender.com`

For `tanilink-web`:

- `VITE_API_URL=https://<your-backend>.onrender.com`

Then trigger a redeploy for both services.

## Notes about this repo on Render

- The backend image starts FastAPI directly from the Dockerfile.
- The backend health check path is `/api/v1/utils/health-check/`.
- The frontend is a static Vite build served by Nginx.
- This setup does not use the local `compose.yml`; Render runs backend, frontend, and Postgres as separate managed resources.

## Auto deploy

`autoDeploy: true` is enabled for both web services in [render.yaml](/D:/CODE/tanilink/render.yaml), so pushes to the connected branch will redeploy automatically.

## Optional follow-up

If you want cleaner production behavior later, the next improvements I would make are:

- add a Render-friendly backend start command that runs migrations before boot
- use a real production email provider instead of the local mailcatcher defaults
- add a custom domain for frontend and backend
