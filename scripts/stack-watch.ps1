# scripts/stack-watch.ps1 — Real-time resource and database monitor for live examiner evaluation
param (
    [int]$IntervalSeconds = 2
)

Write-Host "Starting Stack Watch (refreshing every $IntervalSeconds seconds)... Press Ctrl+C to stop." -ForegroundColor Cyan

while ($true) {
    Clear-Host
    $now = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "=== Stack Resource Watch [$now] ===" -ForegroundColor Green

    Write-Host "`n[1] Container CPU, Memory, and Network I/O:" -ForegroundColor Yellow
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}"

    Write-Host "`n[2] PostgreSQL Active Database Connections:" -ForegroundColor Yellow
    docker compose --env-file .env.docker exec -T db psql -U postgres -d uni_dev -c "SELECT count(*) as active_connections FROM pg_stat_activity;" 2>$null

    Write-Host "`n[3] Container Health & Status:" -ForegroundColor Yellow
    docker compose --env-file .env.docker ps --format "table {{.Name}}\t{{.Service}}\t{{.Status}}\t{{.Ports}}" 2>$null

    Start-Sleep -Seconds $IntervalSeconds
}

