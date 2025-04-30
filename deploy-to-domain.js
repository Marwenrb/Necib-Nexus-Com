/**
 * Deployment Script for Necib Nexus to necibnexus.com
 * 
 * This script deploys your site to the correct project with environment variables set.
 */

const { execSync } = require('child_process');

console.log('===== Necib Nexus Domain Deployment =====');
console.log('');
console.log('Deploying to necibnexus.com with environment variables...');

try {
  // Production deployment with environment variables to the correct project
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
  console.log('Your site should now be accessible at: https://necibnexus.com');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
} 