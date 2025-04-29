/**
 * Direct Deployment Script for Necib Nexus
 * 
 * This script deploys your site with environment variables directly set in the Vercel command.
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('===== Necib Nexus Direct Deployment =====');
console.log('');
console.log('Deploying with all environment variables directly specified...');

try {
  // Direct deployment with environment variables
  const command = `vercel --prod \
  -e NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_4mvgv76 \
  -e NEXT_PUBLIC_EMAILJS_USER_ID=wUB9vu7p0cp-9v6VC \
  -e NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_e62mr5m \
  -e NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID=template_e62mr5m`;
  
  console.log('Running command:');
  console.log(command);
  console.log('');
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('✅ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
} 