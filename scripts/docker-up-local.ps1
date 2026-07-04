$ErrorActionPreference = "Stop"

$env:COMPOSE_MENU = "false"
$env:COMPOSE_PROGRESS = "plain"
$env:CI = "true"

Write-Host "Starting Tanilink with Docker Compose..."
docker compose --ansi never --progress plain up --build --pull never -d

Write-Host ""
Write-Host "Containers:"
docker compose ps

Write-Host ""
Write-Host "Local URLs:"
Write-Host "  Frontend:          http://localhost:5173"
Write-Host "  Backend API:       http://localhost:8000"
Write-Host "  Swagger docs:      http://localhost:8000/docs"
Write-Host "  ML health:         http://localhost:8000/api/v1/ml/health"
Write-Host "  Adminer:           http://localhost:8080"
Write-Host "  Mailcatcher:       http://localhost:1080"
Write-Host "  Traefik dashboard: http://localhost:8090"
Write-Host ""
Write-Host "Follow app logs with:"
Write-Host "  docker compose logs -f backend frontend"
