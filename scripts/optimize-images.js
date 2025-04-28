const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const QUALITY = 80;
const MAX_WIDTH = 1920;

// Function to optimize a single image
async function optimizeImage(imagePath) {
  try {
    const extension = path.extname(imagePath).toLowerCase();
    
    // Skip if not an image we want to optimize
    if (!IMAGE_EXTENSIONS.includes(extension)) {
      return;
    }
    
    console.log(`Optimizing: ${imagePath}`);
    
    // Read the image
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Create Sharp instance
    let sharpImage = sharp(imageBuffer);
    
    // Get metadata
    const metadata = await sharpImage.metadata();
    
    // Resize only if larger than max width
    if (metadata.width > MAX_WIDTH) {
      sharpImage = sharpImage.resize(MAX_WIDTH);
    }
    
    // Optimize based on format
    let optimizedBuffer;
    if (extension === '.jpg' || extension === '.jpeg') {
      optimizedBuffer = await sharpImage.jpeg({ quality: QUALITY }).toBuffer();
    } else if (extension === '.png') {
      optimizedBuffer = await sharpImage.png({ quality: QUALITY }).toBuffer();
    } else if (extension === '.webp') {
      optimizedBuffer = await sharpImage.webp({ quality: QUALITY }).toBuffer();
    }
    
    // Save optimized image
    fs.writeFileSync(imagePath, optimizedBuffer);
    
    // Generate WebP version for non-webp images
    if (extension !== '.webp') {
      const webpPath = imagePath.replace(extension, '.webp');
      const webpBuffer = await sharpImage.webp({ quality: QUALITY }).toBuffer();
      fs.writeFileSync(webpPath, webpBuffer);
    }
    
    console.log(`✓ Optimized: ${imagePath}`);
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error.message);
  }
}

// Function to walk through directories
function processDirectory(directoryPath) {
  const items = fs.readdirSync(directoryPath);
  
  for (const item of items) {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Skip node_modules
      if (item === 'node_modules') continue;
      
      // Process subdirectory
      processDirectory(itemPath);
    } else if (stats.isFile()) {
      // Process file if it's an image
      optimizeImage(itemPath);
    }
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  processDirectory(PUBLIC_DIR);
  console.log('Image optimization complete!');
}

// Run the script
main().catch(console.error); 