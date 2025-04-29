# Vercel Environment Variables Setup Script (PowerShell version)
# 
# This script helps you upload environment variables to Vercel.
# Run this script with your actual EmailJS credentials to automatically
# set up your environment variables in Vercel.
# 
# Requirements:
# - Vercel CLI installed: npm i -g vercel
# - Logged in to Vercel: vercel login
# 
# Usage:
# .\setup-vercel-env.ps1 YOUR_EMAILJS_USER_ID YOUR_CONTACT_TEMPLATE_ID YOUR_CLUB_TEMPLATE_ID

# Default service ID from the code
$SERVICE_ID = "service_4mvgv76"

# Check arguments
if ($args.Count -lt 3) {
    Write-Host "Error: Missing arguments." -ForegroundColor Red
    Write-Host "Usage: .\setup-vercel-env.ps1 YOUR_EMAILJS_USER_ID YOUR_CONTACT_TEMPLATE_ID YOUR_CLUB_TEMPLATE_ID" -ForegroundColor Yellow
    exit 1
}

$USER_ID = $args[0]
$CONTACT_TEMPLATE_ID = $args[1]
$CLUB_TEMPLATE_ID = $args[2]

Write-Host "=== Necib Nexus - Vercel Environment Setup ===" -ForegroundColor Blue
Write-Host "Setting up EmailJS environment variables..." -ForegroundColor Cyan

try {
    # Create .env file for Vercel
    $env_content = @"
NEXT_PUBLIC_EMAILJS_SERVICE_ID=$SERVICE_ID
NEXT_PUBLIC_EMAILJS_USER_ID=$USER_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=$CONTACT_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID=$CLUB_TEMPLATE_ID
"@

    Set-Content -Path ".\.env.production.local" -Value $env_content

    # Pull existing Vercel environment
    Write-Host "Pulling existing Vercel configuration..." -ForegroundColor Cyan
    vercel pull --yes

    # Add environment variables to Vercel project
    Write-Host "Setting environment variables in Vercel..." -ForegroundColor Cyan
    vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID production
    Write-Output $SERVICE_ID | vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID production

    vercel env add NEXT_PUBLIC_EMAILJS_USER_ID production
    Write-Output $USER_ID | vercel env add NEXT_PUBLIC_EMAILJS_USER_ID production

    vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_ID production
    Write-Output $CONTACT_TEMPLATE_ID | vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_ID production

    vercel env add NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID production
    Write-Output $CLUB_TEMPLATE_ID | vercel env add NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID production

    Write-Host "✓ Environment variables set successfully!" -ForegroundColor Green
    Write-Host "To deploy with these variables, run:" -ForegroundColor Cyan
    Write-Host "vercel --prod" -ForegroundColor Yellow

} catch {
    Write-Host "Error setting environment variables: $_" -ForegroundColor Red
    Write-Host "You can set them manually in the Vercel dashboard." -ForegroundColor Yellow
    
    # Create a backup file with the variables
    Set-Content -Path ".\vercel-env-backup.txt" -Value $env_content
    Write-Host "Created backup file vercel-env-backup.txt with your variables." -ForegroundColor Green
} 