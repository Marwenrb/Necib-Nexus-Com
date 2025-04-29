# Necib Nexus Deployment PowerShell Script
# This script creates a .env file and deploys your project to Vercel

# Known values are already set
$SERVICE_ID = "service_4mvgv76"
$CONTACT_TEMPLATE_ID = "template_e62mr5m"

# Clear the screen
Clear-Host

# Print banner
Write-Host "===== Necib Nexus Deployment Helper =====" -ForegroundColor Blue
Write-Host ""
Write-Host "This script will help you deploy your site with the correct environment variables." -ForegroundColor Cyan
Write-Host ""
Write-Host "Using:" -ForegroundColor Green
Write-Host "- Service ID: $SERVICE_ID" -ForegroundColor Green
Write-Host "- Contact Template ID: $CONTACT_TEMPLATE_ID" -ForegroundColor Green
Write-Host ""

# Ask for remaining EmailJS credentials
Write-Host "Please enter your EmailJS credentials:" -ForegroundColor Yellow
$USER_ID = Read-Host "EmailJS User ID (public key)"

# Validate User ID
if (-not $USER_ID) {
    Write-Host "Error: User ID is required!" -ForegroundColor Red
    exit 1
}

$CLUB_TEMPLATE_ID = Read-Host "EmailJS Club Template ID (press Enter to use the same as contact)"

# If no club template is provided, use the contact template
if (-not $CLUB_TEMPLATE_ID) {
    $CLUB_TEMPLATE_ID = $CONTACT_TEMPLATE_ID
    Write-Host "Using contact template for club form as well." -ForegroundColor Yellow
}

# Create .env file
$env_content = @"
NEXT_PUBLIC_EMAILJS_SERVICE_ID=$SERVICE_ID
NEXT_PUBLIC_EMAILJS_USER_ID=$USER_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=$CONTACT_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID=$CLUB_TEMPLATE_ID
"@

Set-Content -Path ".\.env.production" -Value $env_content
Write-Host "✅ Created .env.production file with your environment variables" -ForegroundColor Green

# Ask about deployment
$deploy = Read-Host "Do you want to deploy to Vercel now? (y/n)"

if ($deploy.ToLower() -eq "y") {
    $prod = Read-Host "Deploy to production? (y/n)"
    
    if ($prod.ToLower() -eq "y") {
        Write-Host "🚀 Deploying to production..." -ForegroundColor Magenta
        vercel --prod --env-file .env.production
    } else {
        Write-Host "🚀 Deploying to preview environment..." -ForegroundColor Magenta
        vercel --env-file .env.production
    }
    
    Write-Host "✅ Deployment process completed!" -ForegroundColor Green
} else {
    Write-Host "Environment file created. You can deploy later with:" -ForegroundColor Yellow
    Write-Host "vercel --env-file .env.production" -ForegroundColor Cyan
    Write-Host "or for production:" -ForegroundColor Yellow
    Write-Host "vercel --prod --env-file .env.production" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Thank you for using Necib Nexus Deployment Helper!" -ForegroundColor Blue 