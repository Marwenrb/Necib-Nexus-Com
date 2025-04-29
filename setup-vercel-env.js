/**
 * Vercel Environment Variables Setup Script
 * 
 * This script helps you upload environment variables to Vercel.
 * Run this script with your actual EmailJS credentials to automatically
 * set up your environment variables in Vercel.
 * 
 * Requirements:
 * - Vercel CLI installed: npm i -g vercel
 * - Logged in to Vercel: vercel login
 * 
 * Usage:
 * node setup-vercel-env.js YOUR_EMAILJS_USER_ID YOUR_CONTACT_TEMPLATE_ID YOUR_CLUB_TEMPLATE_ID
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Default service ID from the code
const SERVICE_ID = 'service_4mvgv76';

// Get credentials from command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('\x1b[31mError: Missing arguments.\x1b[0m');
  console.log('\x1b[33mUsage: node setup-vercel-env.js YOUR_EMAILJS_USER_ID YOUR_CONTACT_TEMPLATE_ID YOUR_CLUB_TEMPLATE_ID\x1b[0m');
  process.exit(1);
}

const [userId, contactTemplateId, clubTemplateId] = args;

console.log('\x1b[34m=== Necib Nexus - Vercel Environment Setup ===\x1b[0m');
console.log('\x1b[36mSetting up EmailJS environment variables...\x1b[0m');

// Add environment variables to Vercel
try {
  // Service ID
  console.log('Setting NEXT_PUBLIC_EMAILJS_SERVICE_ID...');
  execSync(`vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID production`, {stdio: 'pipe'});
  fs.writeFileSync('.vercel-env-input.tmp', SERVICE_ID);
  execSync(`type .vercel-env-input.tmp | vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID production`, {stdio: 'inherit'});
  fs.unlinkSync('.vercel-env-input.tmp');
  
  // User ID
  console.log('Setting NEXT_PUBLIC_EMAILJS_USER_ID...');
  fs.writeFileSync('.vercel-env-input.tmp', userId);
  execSync(`type .vercel-env-input.tmp | vercel env add NEXT_PUBLIC_EMAILJS_USER_ID production`, {stdio: 'inherit'});
  fs.unlinkSync('.vercel-env-input.tmp');
  
  // Contact Template ID
  console.log('Setting NEXT_PUBLIC_EMAILJS_TEMPLATE_ID...');
  fs.writeFileSync('.vercel-env-input.tmp', contactTemplateId);
  execSync(`type .vercel-env-input.tmp | vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_ID production`, {stdio: 'inherit'});
  fs.unlinkSync('.vercel-env-input.tmp');
  
  // Club Template ID
  console.log('Setting NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID...');
  fs.writeFileSync('.vercel-env-input.tmp', clubTemplateId);
  execSync(`type .vercel-env-input.tmp | vercel env add NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID production`, {stdio: 'inherit'});
  fs.unlinkSync('.vercel-env-input.tmp');
  
  console.log('\x1b[32m✓ Environment variables set successfully!\x1b[0m');
  console.log('\x1b[36mTo deploy with these variables, run:\x1b[0m');
  console.log('\x1b[33mvercel --prod\x1b[0m');
  
} catch (error) {
  console.error('\x1b[31mError setting environment variables:\x1b[0m', error.message);
  console.log('\x1b[33mYou can set them manually in the Vercel dashboard.\x1b[0m');
  
  // Create a backup file with the variables
  const envContent = `NEXT_PUBLIC_EMAILJS_SERVICE_ID=${SERVICE_ID}
NEXT_PUBLIC_EMAILJS_USER_ID=${userId}
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=${contactTemplateId}
NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID=${clubTemplateId}
`;
  
  fs.writeFileSync('vercel-env-backup.txt', envContent);
  console.log('\x1b[32mCreated backup file vercel-env-backup.txt with your variables.\x1b[0m');
} 