#!/usr/bin/env node

/**
 * Quick Performance Metrics for Portfolio
 * Measures bundle size and provides performance insights
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🚀 PORTFOLIO PERFORMANCE CHECK\n');
console.log('═'.repeat(60));

// 1. Build Status
console.log('\n📦 BUILD STATUS:');
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
    console.log('   ✅ Build directory found');
} else {
    console.log('   ❌ No build found - run: npm run build');
    process.exit(1);
}

// 2. Bundle Analysis
console.log('\n📊 BUNDLE SIZE:');

function getSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch {
        return 0;
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return ((bytes / Math.pow(k, i)) * 100 | 0) / 100 + ' ' + sizes[i];
}

function walkDir(dir, callback) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filepath = path.join(dir, file);
            if (fs.statSync(filepath).isDirectory()) {
                walkDir(filepath, callback);
            } else {
                callback(filepath);
            }
        });
    } catch (e) {
        // Skip inaccessible directories
    }
}

let jsSize = 0, cssSize = 0, htmlSize = 0;
let jsCount = 0, cssCount = 0, htmlCount = 0;

walkDir(nextDir, (file) => {
    const size = getSize(file);
    if (file.endsWith('.js')) {
        jsSize += size;
        jsCount++;
    } else if (file.endsWith('.css')) {
        cssSize += size;
        cssCount++;
    } else if (file.endsWith('.html')) {
        htmlSize += size;
        htmlCount++;
    }
});

console.log(`   JavaScript: ${formatBytes(jsSize)} (${jsCount} files)`);
console.log(`   CSS:        ${formatBytes(cssSize)} (${cssCount} files)`);
console.log(`   HTML:       ${formatBytes(htmlSize)} (${htmlCount} files)`);
console.log(`   Total:      ${formatBytes(jsSize + cssSize + htmlSize)}`);

// 3. Performance Recommendations
console.log('\n💡 PERFORMANCE TIPS:');
const tips = [
    'Use dynamic imports for heavy components',
    'Implement image lazy loading',
    'Enable production mode for smallest bundle',
    'Use CSS modules to prevent duplication',
    'Monitor Core Web Vitals after deployment',
];
tips.forEach((tip, i) => console.log(`   ${i + 1}. ${tip}`));

// 4. Testing
console.log('\n🧪 HOW TO TEST:');
console.log('   1. Deploy to Vercel/Netlify');
console.log('   2. Test with: https://pagespeed.web.dev/');
console.log('   3. Local test: npm run build && npm run start');
console.log('   4. Lighthouse: npx lighthouse http://localhost:3000');

console.log('\n' + '═'.repeat(60) + '\n');
