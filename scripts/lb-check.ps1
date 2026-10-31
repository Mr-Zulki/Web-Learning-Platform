param (
    [int]$Count = 40,
    [string]$Url = "http://localhost:8080/api/health"
)

Write-Host "Sending $Count requests to $Url..." -ForegroundColor Cyan

$counts = @{}
$failedRequests = 0

for ($i = 1; $i -le $Count; $i++) {
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        $servedBy = $response.Headers["X-Served-By"]
        
        if (-not $servedBy) {
            # Fallback to response JSON instance property
            $json = $response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($json.instance) {
                $servedBy = $json.instance
            } else {
                $servedBy = "unknown"
            }
        }
        
        # If header returned array or comma-separated string, take first
        if ($servedBy -is [array]) {
            $servedBy = $servedBy[0]
        }
        if ($servedBy -match ",") {
            $servedBy = ($servedBy -split ",")[0].Trim()
        }
        $servedBy = $servedBy.Trim()

        if ($counts.ContainsKey($servedBy)) {
            $counts[$servedBy]++
        } else {
            $counts[$servedBy] = 1
        }
    }
    catch {
        $failedRequests++
        Write-Warning "Request #$i failed: $_"
    }
}

Write-Host "`n--- Load Balancing Distribution Summary ---" -ForegroundColor Green
$table = foreach ($key in $counts.Keys) {
    [PSCustomObject]@{
        "Instance ID" = $key
        "Requests" = $counts[$key]
        "Percentage" = ("{0:P1}" -f ($counts[$key] / $Count))
    }
}

$table | Format-Table -AutoSize
Write-Host "Failed Requests: $failedRequests"

$uniqueCount = $counts.Keys.Count
Write-Host "`nUnique instances detected: $uniqueCount"

if ($uniqueCount -le 1) {
    Write-Error "Load balancing check FAILED: Only $uniqueCount unique instance responded out of $Count requests."
    exit 1
}

Write-Host "Load balancing check PASSED: Traffic successfully distributed across $uniqueCount instances." -ForegroundColor Green
exit 0

