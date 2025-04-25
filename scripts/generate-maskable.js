const svgToImg = require('svg-to-img')
const fs = require('fs')
const path = require('path')

async function generateMaskableIcon() {
  try {
    const svgPath = path.join(__dirname, '../public/maskable_icon.svg')
    const pngPath = path.join(__dirname, '../public/maskable_icon.png')

    console.log('🔄 Generating maskable icon for PWA...')

    const svgBuffer = fs.readFileSync(svgPath)
    const pngData = await svgToImg.from(svgBuffer).toPng({
      width: 512,
      height: 512,
    })

    fs.writeFileSync(pngPath, pngData)
    console.log('✅ Generated maskable_icon.png')
  } catch (error) {
    console.error('❌ Error generating maskable icon:', error.message)
  }
}

generateMaskableIcon()
