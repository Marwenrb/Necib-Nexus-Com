/**
 * Quick Deployment Script for Necib Nexus
 * 
 * This script deploys your site with the known EmailJS values
 * and prompts only for the missing information.
 */

const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

// Known values
const SERVICE_ID = 'service_4mvgv76';
const CONTACT_TEMPLATE_ID = 'template_e62mr5m';

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Clear console and show banner
console.clear();
console.log('===== Necib Nexus Quick Deploy =====');
console.log('');
console.log('This script will deploy your site with your EmailJS configuration.');
console.log('');
console.log('Using:');
console.log(`- Service ID: ${SERVICE_ID}`);
console.log(`- Contact Template ID: ${CONTACT_TEMPLATE_ID}`);
console.log('');

// Get missing information
rl.question('Enter your EmailJS User ID (public key): ', (userId) => {
  if (!userId) {
    console.log('❌ User ID is required');
    rl.close();
    return;
  }
  
  rl.question('Enter Club Template ID (or press Enter to use the same as contact): ', (clubTemplateId) => {
    // If no club template ID is provided, use the contact template ID
    const finalClubTemplateId = clubTemplateId || CONTACT_TEMPLATE_ID;
    
    // Create .env.production file
    const envContent = `NEXT_PUBLIC_EMAILJS_SERVICE_ID=${SERVICE_ID}
NEXT_PUBLIC_EMAILJS_USER_ID=${userId}
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=${CONTACT_TEMPLATE_ID}
NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID=${finalClubTemplateId}`;
    
    fs.writeFileSync('.env.production', envContent);
    console.log('✅ Created .env.production file');
    
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
  });
}); 