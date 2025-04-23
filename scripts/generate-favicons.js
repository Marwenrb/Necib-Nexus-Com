/**
 * Premium Favicon Generator for Necib Nexus
 * Creates a complete set of modern, high-quality favicons
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const svgToImg = require('svg-to-img');
const pngToIco = require('png-to-ico');
const colors = require('colors/safe');

// Color definitions for brand identity
const BRAND_PRIMARY = '#6441A5';
const BRAND_SECONDARY = '#41BEC8';
const BACKGROUND_COLOR = '#FFFFFF';

// Define paths
const SVG_PATH = path.join(__dirname, '../public/favicon.svg');
const PUBLIC_PATH = path.join(__dirname, '../public');
const BACKUP_PATH = path.join(__dirname, '../public/favicon-backup');

// Size configurations for different platforms
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 57, name: 'apple-touch-icon-57x57.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 70, name: 'mstile-70x70.png' },
  { size: 144, name: 'mstile-144x144.png' },
  { size: 150, name: 'mstile-150x150.png' },
  { size: 310, name: 'mstile-310x310.png' },
  { size: 310, width: 150, name: 'mstile-310x150.png' },
];

/**
 * Create backup directory for existing favicon files
 */
async function createBackup() {
  console.log(colors.blue('📦 Creating backup of existing favicon files...'));
  
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.mkdirSync(BACKUP_PATH, { recursive: true });
  }
  
  // Files to backup
  const faviconFiles = [
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'apple-touch-icon.png',
    'mstile-70x70.png',
    'mstile-144x144.png',
    'mstile-150x150.png',
    'mstile-310x150.png',
    'mstile-310x310.png',
    'safari-pinned-tab.svg'
  ];
  
  for (const file of faviconFiles) {
    const sourcePath = path.join(PUBLIC_PATH, file);
    const destPath = path.join(BACKUP_PATH, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(colors.green(`✓ Backed up ${file}`));
    }
  }
  
  console.log(colors.green('✅ Backup completed successfully!'));
}

/**
 * Generate Safari pinned tab SVG
 */
async function generateSafariPinnedTab() {
  console.log(colors.blue('🔄 Generating Safari pinned tab SVG...'));
  
  // Create a solid black version of the icon for Safari pinned tab
  const safariSvgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="240" fill="black" />
  <path d="M152 180V330M152 180L208 330M152 180H208M208 180V330" 
        stroke="white" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M302 180V330M302 180L358 330M302 180H358M358 180V330" 
        stroke="white" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

  const safariPinnedTabPath = path.join(PUBLIC_PATH, 'safari-pinned-tab.svg');
  fs.writeFileSync(safariPinnedTabPath, safariSvgContent);
  console.log(colors.green('✓ Generated safari-pinned-tab.svg'));
}

/**
 * Generate PNG files from SVG in various sizes
 */
async function generatePngFiles() {
  console.log(colors.blue('📐 Converting SVG to PNG in various sizes...'));
  
  // Ensure source SVG file exists
  if (!fs.existsSync(SVG_PATH)) {
    console.error(colors.red('❌ Error: favicon.svg not found in public directory'));
    process.exit(1);
  }
  
  try {
    // Convert SVG to PNG with transparency
    const svgBuffer = fs.readFileSync(SVG_PATH);
    
    // Generate all sizes in parallel
    await Promise.all(sizes.map(async (sizeConfig) => {
      const width = sizeConfig.width || sizeConfig.size;
      const height = sizeConfig.size;
      const outputPath = path.join(PUBLIC_PATH, sizeConfig.name);
      
      try {
        const pngData = await svgToImg.from(svgBuffer).toPng({
          width,
          height,
        });
        
        fs.writeFileSync(outputPath, pngData);
        console.log(colors.green(`✓ Generated ${sizeConfig.name}`));
      } catch (error) {
        console.error(colors.red(`❌ Error generating ${sizeConfig.name}:`), error.message);
      }
    }));
  } catch (error) {
    console.error(colors.red('❌ Error generating PNG files:'), error.message);
  }
}

/**
 * Generate favicon.ico file
 */
async function generateFaviconIco() {
  console.log(colors.blue('🔄 Generating favicon.ico...'));
  
  try {
    const favicon16Path = path.join(PUBLIC_PATH, 'favicon-16x16.png');
    const favicon32Path = path.join(PUBLIC_PATH, 'favicon-32x32.png');
    const favicon48Path = path.join(PUBLIC_PATH, 'favicon-48x48.png');
    
    // Check if the PNG files exist
    const pngPaths = [];
    if (fs.existsSync(favicon16Path)) pngPaths.push(favicon16Path);
    if (fs.existsSync(favicon32Path)) pngPaths.push(favicon32Path);
    if (fs.existsSync(favicon48Path)) pngPaths.push(favicon48Path);
    
    if (pngPaths.length === 0) {
      console.error(colors.red('❌ Error: No PNG files found for favicon.ico generation'));
      return;
    }
    
    const icoBuffer = await pngToIco(pngPaths);
    fs.writeFileSync(path.join(PUBLIC_PATH, 'favicon.ico'), icoBuffer);
    console.log(colors.green('✓ Generated favicon.ico'));
  } catch (error) {
    console.error(colors.red('❌ Error generating favicon.ico:'), error.message);
  }
}

/**
 * Update configuration files with new brand colors
 */
async function updateConfigFiles() {
  console.log(colors.blue('🎨 Updating configuration files...'));
  
  // Update browserconfig.xml
  try {
    const browserconfigPath = path.join(PUBLIC_PATH, 'browserconfig.xml');
    if (fs.existsSync(browserconfigPath)) {
      let browserconfig = fs.readFileSync(browserconfigPath, 'utf8');
      browserconfig = browserconfig.replace(/<TileColor>#[a-fA-F0-9]{6}<\/TileColor>/, `<TileColor>${BRAND_PRIMARY}</TileColor>`);
      fs.writeFileSync(browserconfigPath, browserconfig);
      console.log(colors.green('✓ Updated browserconfig.xml'));
    }
  } catch (error) {
    console.error(colors.red('❌ Error updating browserconfig.xml:'), error.message);
  }
  
  // Update site.webmanifest
  try {
    const webmanifestPath = path.join(PUBLIC_PATH, 'site.webmanifest');
    if (fs.existsSync(webmanifestPath)) {
      let webmanifest = fs.readFileSync(webmanifestPath, 'utf8');
      webmanifest = webmanifest.replace(/"theme_color":\s*"#[a-fA-F0-9]{6}"/, `"theme_color": "${BRAND_PRIMARY}"`);
      webmanifest = webmanifest.replace(/"background_color":\s*"#[a-fA-F0-9]{6}"/, `"background_color": "${BACKGROUND_COLOR}"`);
      fs.writeFileSync(webmanifestPath, webmanifest);
      console.log(colors.green('✓ Updated site.webmanifest'));
    }
  } catch (error) {
    console.error(colors.red('❌ Error updating site.webmanifest:'), error.message);
  }
}

/**
 * Run the full favicon generation process
 */
async function generateFavicons() {
  console.log(colors.blue.bold('🚀 Starting premium favicon generation for Necib Nexus...'));
  
  try {
    // Install dependencies if needed
    if (!fs.existsSync(path.join(__dirname, '../node_modules/sharp'))) {
      console.log(colors.yellow('📦 Installing required dependencies...'));
      require('child_process').execSync('npm install --save-dev sharp svg-to-img png-to-ico colors', {
        stdio: 'inherit'
      });
    }
    
    // Create backup of existing favicon files
    await createBackup();
    
    // Generate Safari pinned tab SVG
    await generateSafariPinnedTab();
    
    // Generate PNG files
    await generatePngFiles();
    
    // Generate favicon.ico
    await generateFaviconIco();
    
    // Update configuration files
    await updateConfigFiles();
    
    console.log(colors.green.bold('✅ All favicon assets have been generated successfully!'));
    console.log(colors.blue.bold('🌟 Your premium UI/UX favicons are ready to use.'));
    console.log(colors.blue('💡 Tip: Test your favicons on different devices and browsers to ensure optimal display.'));
  } catch (error) {
    console.error(colors.red('❌ Error during favicon generation:'), error.message);
  }
}

// Execute the script
generateFavicons(); 