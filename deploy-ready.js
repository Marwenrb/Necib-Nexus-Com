/**
 * Necib Nexus Ready-to-Deploy Script
 * 
 * This script deploys your site with all EmailJS values already configured.
 * Just run this script and choose whether to deploy to production or preview.
 */

const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

// All values are now known
const ENV_CONTENT = `NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_4mvgv76
NEXT_PUBLIC_EMAILJS_USER_ID=wUB9vu7p0cp-9v6VC
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_e62mr5m
NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID=template_e62mr5m`;

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Clear console and show banner
console.clear();
console.log('===== Necib Nexus Ready to Deploy =====');
console.log('');
console.log('All configuration values are set:');
console.log('- Service ID: service_4mvgv76');
console.log('- User ID: wUB9vu7p0cp-9v6VC');
console.log('- Template ID: template_e62mr5m');
console.log('');

// Create the environment file
fs.writeFileSync('.env.production', ENV_CONTENT);
console.log('✅ Created .env.production file with all values');

// Ask about deployment
rl.question('Deploy to production? (y/n): ', (answer) => {
  const isProd = answer.toLowerCase() === 'y';
  
  try {
    console.log(`🚀 Deploying to ${isProd ? 'production' : 'preview'}...`);
    const command = isProd 
      ? 'vercel --prod --env-file .env.production' 
      : 'vercel --env-file .env.production';
    
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Deployment successful!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
  
  rl.close();
}); 