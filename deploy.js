/**
 * Deployment Helper Script for Necib Nexus
 * Run this script before deploying to verify everything is set up correctly
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

console.log(`${colors.blue}Necib Nexus Deployment Checker${colors.reset}`);
console.log('-------------------------------');

// Check for environment variables
console.log(`${colors.yellow}Checking environment variables...${colors.reset}`);
const envVars = [
  'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
  'NEXT_PUBLIC_EMAILJS_USER_ID',
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID',
  'NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID',
];

let missingVars = false;
for (const envVar of envVars) {
  if (!process.env[envVar]) {
    console.log(`${colors.red}Missing environment variable: ${envVar}${colors.reset}`);
    missingVars = true;
  }
}

if (!missingVars) {
  console.log(`${colors.green}Environment variables check passed${colors.reset}`);
}

// Check package.json for overrides
console.log(`${colors.yellow}Checking package.json for dependency overrides...${colors.reset}`);
const packageJson = require('./package.json');
const requiredOverrides = ['scheduler', 'zustand'];

if (packageJson.pnpm && packageJson.pnpm.overrides) {
  let missingOverrides = false;
  for (const override of requiredOverrides) {
    if (!packageJson.pnpm.overrides[override]) {
      console.log(`${colors.red}Missing override for ${override} in package.json${colors.reset}`);
      missingOverrides = true;
    }
  }
  
  if (!missingOverrides) {
    console.log(`${colors.green}Package overrides check passed${colors.reset}`);
  }
} else {
  console.log(`${colors.red}No overrides found in package.json${colors.reset}`);
}

// Check next.config.js
console.log(`${colors.yellow}Checking next.config.js...${colors.reset}`);
const nextConfigPath = path.join(__dirname, 'next.config.js');
const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

if (nextConfig.includes("output: 'export'") || nextConfig.includes('output: "export"')) {
  console.log(`${colors.red}Warning: next.config.js contains 'output: export' which limits Next.js features${colors.reset}`);
} else {
  console.log(`${colors.green}Next.js config check passed${colors.reset}`);
}

console.log('-------------------------------');
console.log(`${colors.blue}Deployment preparation complete${colors.reset}`);
console.log('Run the following command to deploy:');
console.log(`${colors.green}vercel${colors.reset}`); 