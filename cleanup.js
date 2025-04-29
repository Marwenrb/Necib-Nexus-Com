/**
 * Cleanup script for Necib Nexus deployment
 * Removes temporary files and caches that might interfere with deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to delete
const dirsToDelete = [
  '.next',
  'out',
  '.vercel/output'
];

// Function to check if directory exists
function dirExists(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch (err) {
    return false;
  }
}

// Function to delete a directory
function deleteDir(dir) {
  if (dirExists(dir)) {
    console.log(`Deleting ${dir}...`);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Deleted ${dir}`);
  } else {
    console.log(`Directory ${dir} does not exist, skipping`);
  }
}

// Main function
function cleanup() {
  console.log('Starting cleanup...');
  
  // Delete directories
  dirsToDelete.forEach(dir => {
    deleteDir(dir);
  });
  
  // Clean pnpm cache
  try {
    console.log('Running pnpm store prune...');
    execSync('pnpm store prune', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error pruning pnpm store:', error.message);
  }
  
  console.log('Cleanup completed successfully');
}

// Run cleanup
cleanup(); 