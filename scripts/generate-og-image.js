#!/usr/bin/env node

/**
 * OG Image Generator for Portfolio
 * 
 * This script generates a professional 1200x630px OG (Open Graph) image
 * for social media sharing using the sharp library.
 * 
 * Usage:
 *   npm run generate:og-image
 *   or
 *   node scripts/generate-og-image.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Get siteConfig values
const siteConfig = {
  fullName: 'Okeson',
  title: 'Cybersecurity & Full-Stack Developer',
  domain: 'okeson.dev',
};

const width = 1200;
const height = 630;

// SVG template for the OG image
const createSvg = () => `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0f1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a1628;stop-opacity:1" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,255,150,0.03)" stroke-width="1"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
  
  <!-- Grid overlay -->
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  
  <!-- Terminal prefix -->
  <text x="60" y="100" font-family="'JetBrains Mono', monospace" font-size="24" fill="#00ff96">> portfolio.dev</text>
  
  <!-- Name -->
  <text x="60" y="260" font-family="'JetBrains Mono', monospace" font-size="72" font-weight="700" fill="#ffffff">${siteConfig.fullName}</text>
  
  <!-- Title -->
  <text x="60" y="330" font-family="'JetBrains Mono', monospace" font-size="32" fill="#94a3b8">${siteConfig.title}</text>
  
  <!-- Tags Group -->
  <!-- Tag 1 -->
  <rect x="60" y="370" width="130" height="40" rx="6" fill="rgba(0,255,150,0.1)" stroke="rgba(0,255,150,0.3)" stroke-width="1"/>
  <text x="75" y="397" font-family="'JetBrains Mono', monospace" font-size="18" fill="#00ff96">React</text>
  
  <!-- Tag 2 -->
  <rect x="210" y="370" width="150" height="40" rx="6" fill="rgba(0,255,150,0.1)" stroke="rgba(0,255,150,0.3)" stroke-width="1"/>
  <text x="225" y="397" font-family="'JetBrains Mono', monospace" font-size="18" fill="#00ff96">Next.js</text>
  
  <!-- Tag 3 -->
  <rect x="380" y="370" width="170" height="40" rx="6" fill="rgba(0,255,150,0.1)" stroke="rgba(0,255,150,0.3)" stroke-width="1"/>
  <text x="395" y="397" font-family="'JetBrains Mono', monospace" font-size="18" fill="#00ff96">TypeScript</text>
  
  <!-- Tag 4 -->
  <rect x="570" y="370" width="140" height="40" rx="6" fill="rgba(0,255,150,0.1)" stroke="rgba(0,255,150,0.3)" stroke-width="1"/>
  <text x="585" y="397" font-family="'JetBrains Mono', monospace" font-size="18" fill="#00ff96">Security</text>
  
  <!-- Domain (top right) -->
  <text x="1100" y="100" font-family="'JetBrains Mono', monospace" font-size="22" fill="#475569" text-anchor="end">${siteConfig.domain}</text>
</svg>
`;

async function generateOgImage() {
  try {
    const outputDir = path.join(__dirname, '../public');
    const outputPath = path.join(outputDir, 'og-image.png');

    // Create public directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('🎨 Generating OG image...');
    console.log(`   Name: ${siteConfig.fullName}`);
    console.log(`   Title: ${siteConfig.title}`);
    console.log(`   Domain: ${siteConfig.domain}`);
    console.log(`   Dimensions: ${width}x${height}px`);

    // Generate PNG from SVG
    await sharp(Buffer.from(createSvg()))
      .png()
      .toFile(outputPath);

    // Get file size
    const stats = fs.statSync(outputPath);
    const fileSizeKb = (stats.size / 1024).toFixed(2);

    console.log(`\n✅ OG image generated successfully!`);
    console.log(`   Location: ${outputPath}`);
    console.log(`   Size: ${fileSizeKb}KB`);
    console.log(`\n📤 Next steps:`);
    console.log(`   1. Deploy your site`);
    console.log(`   2. Test at: https://opengraph.xyz/`);
    console.log(`   3. Share on social media!`);
  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    console.error('\n📦 If you see "Cannot find module sharp"');
    console.error('   Run: npm install sharp --save-dev');
    process.exit(1);
  }
}

generateOgImage();
