# KEYSTONE Health Verification Script (PowerShell)

Write-Host "Verifying KEYSTONE Backend Health..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method Get
    if ($response.status -eq "UP") {
        Write-Host "SUCCESS: Spring Boot Backend is UP and Healthy!" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Backend status is $($response.status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Backend health endpoint not responding on http://localhost:8080/actuator/health" -ForegroundColor Red
}
