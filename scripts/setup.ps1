# KEYSTONE Local Development Setup Script (PowerShell)

Write-Host "Initializing KEYSTONE Development Environment..." -ForegroundColor Cyan

# 1. Environment file check
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# 2. Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
node --version

# 3. Docker Compose launch
Write-Host "Launching PostgreSQL & Spring Boot via Docker Compose..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host "KEYSTONE Stack Initialized successfully!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080/actuator/health" -ForegroundColor Green
Write-Host "Swagger UI:  http://localhost:8080/swagger-ui.html" -ForegroundColor Green
