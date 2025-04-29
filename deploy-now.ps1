# Necib Nexus One-Click Deployment Script
# All EmailJS values are pre-configured

# Clear the screen
Clear-Host

# Print banner
Write-Host "===== Necib Nexus One-Click Deploy =====" -ForegroundColor Blue
Write-Host ""
Write-Host "All configuration values are set:" -ForegroundColor Cyan
Write-Host "- Service ID: service_4mvgv76" -ForegroundColor Green
Write-Host "- User ID: wUB9vu7p0cp-9v6VC" -ForegroundColor Green
Write-Host "- Template ID: template_e62mr5m" -ForegroundColor Green
Write-Host ""

# Create .env file with all values
$env_content = @"
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_4mvgv76
NEXT_PUBLIC_EMAILJS_USER_ID=wUB9vu7p0cp-9v6VC
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_e62mr5m
NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID=template_e62mr5m
"@

Set-Content -Path ".\.env.production" -Value $env_content
Write-Host "✅ Created .env.production file with all values" -ForegroundColor Green

# Ask about deployment
$prod = Read-Host "Deploy to production? (y/n)"

if ($prod.ToLower() -eq "y") {
    Write-Host "🚀 Deploying to production..." -ForegroundColor Magenta
    vercel --prod --env-file .env.production
} else {
    Write-Host "🚀 Deploying to preview environment..." -ForegroundColor Magenta
    vercel --env-file .env.production
}

Write-Host "✅ Deployment process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Thank you for using Necib Nexus One-Click Deploy!" -ForegroundColor Blue 