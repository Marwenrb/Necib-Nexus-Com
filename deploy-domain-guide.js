/**
 * Necib Nexus Deployment and DNS Guide
 * 
 * This script deploys your site and provides instructions to set up your domain.
 */

const { execSync } = require('child_process');

console.log('\n===== NECIB NEXUS DOMAIN DEPLOYMENT GUIDE =====\n');
console.log('PART 1: DEPLOYING YOUR SITE');
console.log('Deploying to Vercel with all environment variables...\n');

try {
  // Production deployment with environment variables
  const command = `vercel --prod \
  -e NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_4mvgv76 \
  -e NEXT_PUBLIC_EMAILJS_USER_ID=wUB9vu7p0cp-9v6VC \
  -e NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_e62mr5m \
  -e NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID=template_e62mr5m`;
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n✅ Deployment successful!');
  
  // DNS Configuration Guide
  console.log('\n\n===== PART 2: DNS CONFIGURATION GUIDE =====');
  console.log('Your website shows the One.com "Under Construction" page because the DNS is not configured correctly.');
  console.log('Follow these steps to point your domain to Vercel:\n');
  
  console.log('1. Log in to One.com domain control panel');
  console.log('2. Find the DNS settings or Domain settings section');
  console.log('3. Choose ONE of these options:\n');
  
  console.log('   OPTION A: Change Nameservers (Recommended)');
  console.log('   • Change your nameservers to:');
  console.log('     - ns1.vercel-dns.com');
  console.log('     - ns2.vercel-dns.com\n');
  
  console.log('   OPTION B: Set up A and CNAME Records');
  console.log('   • Create an A Record:');
  console.log('     - Name: @ (or empty)');
  console.log('     - Value: 76.76.21.21');
  console.log('     - TTL: 3600\n');
  
  console.log('   • Create a CNAME Record:');
  console.log('     - Name: www');
  console.log('     - Value: cname.vercel-dns.com');
  console.log('     - TTL: 3600\n');
  
  console.log('4. Wait for DNS changes to propagate (may take up to 48 hours, usually faster)');
  console.log('5. Visit https://necibnexus.com to confirm it works\n');
  
  console.log('For further help, visit: https://vercel.com/docs/projects/domains/transfer-your-domain');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
} 