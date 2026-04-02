#!/usr/bin/env node
// scripts/validate-env.js
// Run via: npm run env:validate
// Exits with non-zero status if required vars are missing

const REQUIRED = [
    'NEXT_PUBLIC_APP_URL',
    'DATABASE_URL',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
];

const WARNINGS = [
    ['RESEND_API_KEY', 'Email features disabled'],
    ['NEXT_PUBLIC_ALGOLIA_APP_ID', 'Search features disabled'],
    ['OPENAI_API_KEY', 'AI features disabled'],
];

let hasError = false;

console.log('\n🔍 Validating environment variables...\n');

// Check required
for (const key of REQUIRED) {
    const val = process.env[key];
    if (!val || val.startsWith('change_me')) {
        console.error(`  ❌ MISSING: ${key}`);
        hasError = true;
    } else {
        console.log(`  ✅ ${key}`);
    }
}

// Warn on optional
console.log('');
for (const [key, impact] of WARNINGS) {
    if (!process.env[key]) {
        console.warn(`  ⚠️  ${key} not set — ${impact}`);
    }
}

if (hasError) {
    console.error('\n❌ Missing required env vars. Run: npm run setup:env\n');
    process.exit(1);
}

console.log('\n✅ Environment valid.\n');
