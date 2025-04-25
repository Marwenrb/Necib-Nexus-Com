const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function generateOgImage() {
  try {
    console.log('🔄 Generating Open Graph image for social sharing...')

    const svgPath = path.join(__dirname, '../public/og-template.svg')
    const pngPath = path.join(__dirname, '../public/og.png')

    // Read the SVG template
    const svgData = fs.readFileSync(svgPath, 'utf8')

    // Generate a high-quality PNG from the SVG
    await sharp(Buffer.from(svgData))
      .resize(1200, 630)
      .png({ quality: 100 })
      .toFile(pngPath)

    console.log('✅ Generated og.png for social media sharing')
  } catch (error) {
    console.error('❌ Error generating OG image:', error.message)
  }
}

generateOgImage()
