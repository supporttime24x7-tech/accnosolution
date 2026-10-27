# Auto-Sync to GitHub Daemon
# Automatically detects file changes, commits them, and pushes directly to GitHub.

$targetDir = "d:\Antigravity 2.0 Web Builder\Accno Solution Website"
Set-Location $targetDir

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ACCNO SOLUTION - GitHub Auto-Sync Active " -ForegroundColor Green
Write-Host "  Repository: supporttime24x7-tech/accnosolution" -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Watching for changes... (Press Ctrl+C to stop)" -ForegroundColor Yellow

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $targetDir
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Filter out ignored directories
$ignorePatterns = @("\.git", "\.next", "node_modules", "\.system_generated")

$debounceTimer = $null
$hasChanges = $false

$action = {
    $path = $Event.SourceEventArgs.FullPath
    
    # Check if path should be ignored
    $shouldIgnore = $false
    foreach ($pattern in $ignorePatterns) {
        if ($path -match $pattern) {
            $shouldIgnore = $true
            break
        }
    }
    
    if (-not $shouldIgnore) {
        $script:hasChanges = $true
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "[$timestamp] Detected change: $path" -ForegroundColor DarkGray
    }
}

Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $action | Out-Null
Register-ObjectEvent $watcher "Renamed" -Action $action | Out-Null

while ($true) {
    Start-Sleep -Seconds 15
    if ($script:hasChanges) {
        $script:hasChanges = $false
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        
        $status = git status --porcelain
        if ($status) {
            Write-Host "[$timestamp] Syncing changes to GitHub..." -ForegroundColor Cyan
            git add .
            git commit -m "Auto-sync update: $timestamp"
            git push origin main
            Write-Host "[$timestamp] Successfully synced to GitHub!" -ForegroundColor Green
        }
    }
}
