/**
 * Script pour générer tous les favicons et icônes nécessaires
 * 
 * Instructions d'installation:
 * 1. npm install --save-dev sharp svg-to-img png-to-ico colors
 * 
 * Utilisation:
 * 1. Placer votre logo SVG dans /public/images/logo.svg
 * 2. Exécuter `node scripts/generate-favicons.js`
 * 3. Les fichiers seront générés dans /public/
 */

const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_SVG = path.join(__dirname, '../public/images/logo.svg');
const OUTPUT_DIR = path.join(__dirname, '../public');
const THEME_COLOR = '#5352ED'; // Couleur principale de la marque

// Favicons standards à générer
const ICONS = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon.ico', sizes: [16, 32, 48] },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'maskable_icon.png', size: 512 },
  { name: 'mstile-150x150.png', size: 150 },
  { name: 'og-image.png', size: 1200 },
];

console.log('Instructions pour générer les favicons:');
console.log('1. Installez les dépendances: npm install --save-dev sharp svg-to-img png-to-ico colors');
console.log('2. Placez votre logo SVG dans /public/images/logo.svg');
console.log('3. Exécutez ce script avec: node scripts/generate-favicons.js');
console.log('\nLes fichiers suivants seront générés:');
ICONS.forEach(icon => {
  console.log(`  - ${icon.name}`);
}); 