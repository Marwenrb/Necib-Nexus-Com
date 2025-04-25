Write-Host "Starting cleanup to free up disk space..." -ForegroundColor Yellow

# Remove Next.js build cache
if (Test-Path '.next') {
    Write-Host "Removing .next directory..." -ForegroundColor Cyan
    Remove-Item -Path '.next' -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove node_modules cache
if (Test-Path 'node_modules\.cache') {
    Write-Host "Removing node_modules\.cache directory..." -ForegroundColor Cyan
    Remove-Item -Path 'node_modules\.cache' -Recurse -Force -ErrorAction SilentlyContinue
}

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Cyan
npm cache clean --force

# Clean Windows temp files
Write-Host "Cleaning Windows temp files..." -ForegroundColor Cyan
Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue

# Show disk space after cleanup
Write-Host "Cleanup completed. Current disk space:" -ForegroundColor Green
Get-PSDrive C | Select-Object Name, Used, Free

Write-Host "You can now restart your Next.js development server." -ForegroundColor Yellow 