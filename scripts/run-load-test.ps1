param (
    [Parameter(Mandatory=$true)]
    [string]$Scenario,
    [Parameter(Mandatory=$true)]
    [string]$OutputDir
)

$scenarioFile = "tests/load/$Scenario.js"
if (-not (Test-Path $scenarioFile)) {
    Write-Error "Scenario file $scenarioFile not found!"
    exit 1
}

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$outputFile = Join-Path $OutputDir "$Scenario.txt"
$statsFile = Join-Path $OutputDir "$Scenario-stats.txt"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Running k6 Scenario: $Scenario" -ForegroundColor Cyan
Write-Host "Output File: $outputFile" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Start a background job to sample docker stats and pg connections
$sampleScript = {
    param($Dir, $Scen)
    $sFile = Join-Path $Dir "$Scen-stats.txt"
    "--- Resource Utilization & DB Connections for $Scen ---" | Out-File -FilePath $sFile -Encoding utf8
    while ($true) {
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        "`n[$timestamp] Docker Container Stats:" | Out-File -FilePath $sFile -Append -Encoding utf8
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | Out-File -FilePath $sFile -Append -Encoding utf8
        
        "`n[$timestamp] PostgreSQL Active Connections:" | Out-File -FilePath $sFile -Append -Encoding utf8
        docker compose --env-file .env.docker exec -T db psql -U postgres -d uni_dev -t -c "SELECT count(*) FROM pg_stat_activity;" 2>&1 | Out-File -FilePath $sFile -Append -Encoding utf8
        Start-Sleep -Seconds 3
    }
}

$job = Start-Job -ScriptBlock $sampleScript -ArgumentList (Convert-Path $OutputDir), $Scenario

try {
    # Run k6 container
    $k6Output = Get-Content $scenarioFile -Raw | docker run --rm -i --network uni-project_internal_net -e TARGET_URL=http://nginx:80 grafana/k6 run - 2>&1
    $k6Output | Out-File -FilePath $outputFile -Encoding utf8
    $k6Output | ForEach-Object { Write-Host $_ }
}
finally {
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -Force -ErrorAction SilentlyContinue
}

# Append stats to main output file for convenience
if (Test-Path $statsFile) {
    "`n==========================================" | Out-File -FilePath $outputFile -Append -Encoding utf8
    Get-Content $statsFile | Out-File -FilePath $outputFile -Append -Encoding utf8
}

Write-Host "`nCompleted $Scenario! Results saved to $outputFile" -ForegroundColor Green

