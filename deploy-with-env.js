/**
 * Simple Vercel Deployment Script with Environment Variables
 * 
 * This script creates a .env file and deploys your project to Vercel
 * with the correct environment variables.
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Get user ID from command line arguments or prompt
console.log('===== Necib Nexus Deployment Helper =====');
console.log('');
console.log('This script will help you deploy your site with the correct environment variables.');
console.log('');

// Create .env file with the provided service ID
const createEnvFile = (userId, templateId, clubTemplateId) => {
  const envContent = `NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_4mvgv76
NEXT_PUBLIC_EMAILJS_USER_ID=${userId}
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=${templateId}
NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID=${clubTemplateId}`;

  fs.writeFileSync('.env.production', envContent);
  console.log('✅ Created .env.production file with your environment variables');
};

// Deploy to Vercel
const deployToVercel = (isProd) => {
  try {
    console.log(`🚀 Deploying to Vercel ${isProd ? 'production' : 'preview'}...`);
    
    // Run vercel command with environment variables
    const command = isProd ? 'vercel --prod --env-file .env.production' : 'vercel --env-file .env.production';
    execSync(command, { stdio: 'inherit' });
    
    console.log('✅ Deployment successful!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
};

// Main function
const main = () => {
  // Check for command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('❌ Missing arguments. Please provide your EmailJS User ID and Template IDs.');
    console.log('');
    console.log('Usage: node deploy-with-env.js YOUR_USER_ID TEMPLATE_ID CLUB_TEMPLATE_ID');
    console.log('Example: node deploy-with-env.js user_abc123 template_xyz789 template_club456');
    return;
  }
  
  const [userId, templateId, clubTemplateId] = args;
  
  // Create .env file
  createEnvFile(userId, templateId, clubTemplateId);
  
  // Ask if they want to deploy to production
  console.log('');
  console.log('Do you want to deploy to production? (y/n)');
  
  // Simple way to get synchronous input in Node.js
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Deploy to production? (y/n): ', (answer) => {
    const isProd = answer.toLowerCase() === 'y';
    deployToVercel(isProd);
    rl.close();
  });
};

// Run the script
main(); 