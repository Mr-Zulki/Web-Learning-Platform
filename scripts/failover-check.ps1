param (
    [string]$Url = "http://localhost:8080/api/health",
    [int]$DurationSeconds = 20
)

Write-Host "--- Passive Failover Verification ---" -ForegroundColor Cyan

# 1. Discover app containers
$containers = docker compose --env-file .env.docker ps -q app
if (-not $containers -or $containers.Count -lt 2) {
    Write-Error "Failover check requires at least 2 running app replicas. Found: $($containers.Count)"
    exit 1
}

$targetContainer = $containers[0].Trim()
$remainingContainer = $containers[1].Trim()
Write-Host "Found $($containers.Count) app replicas."
Write-Host "Simulating failure by stopping replica: $targetContainer" -ForegroundColor Yellow

# 2. Stop one container
docker stop $targetContainer | Out-Null
Write-Host "Replica $targetContainer stopped. Sending requests for $DurationSeconds seconds..." -ForegroundColor Cyan

$successCount = 0
$failCount = 0
$errors = @()
$instancesSeen = @{}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

while ($stopwatch.Elapsed.TotalSeconds -lt $DurationSeconds) {
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            $successCount++
            $inst = $response.Headers["X-Served-By"]
            if ($inst) {
                if ($inst -match ",") {
                    $inst = ($inst -split ",")[0].Trim()
                }
                $instancesSeen[$inst.Trim()] = $true
            }
        } else {
            $failCount++
            $errors += "Status code: $($response.StatusCode)"
        }
    } catch {
        $failCount++
        $errors += $_.Exception.Message
    }
    Start-Sleep -Milliseconds 250
}
$stopwatch.Stop()

Write-Host "`nRestarting stopped replica $targetContainer..." -ForegroundColor Cyan
docker start $targetContainer | Out-Null
Write-Host "Replica $targetContainer restarted successfully." -ForegroundColor Green

# Wait a moment for container to become healthy
Start-Sleep -Seconds 3

Write-Host "`n--- Failover Test Summary ---" -ForegroundColor Green
Write-Host "Total Requests Sent: $($successCount + $failCount)"
Write-Host "Successful 2xx Responses: $successCount"
Write-Host "Failed / Non-2xx Responses: $failCount"
Write-Host "Active Responding Instances: $($instancesSeen.Keys -join ', ')"

if ($failCount -gt 0) {
    Write-Warning "Errors captured during failover switch:"
    $errors | Select-Object -Unique | ForEach-Object { Write-Warning "  - $_" }
} else {
    Write-Host "Zero downtime during replica failure! Passive failover via proxy_next_upstream succeeded." -ForegroundColor Green
}

if ($successCount -eq 0) {
    exit 1
}
exit 0

