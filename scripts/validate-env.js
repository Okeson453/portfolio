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

// Secrets MUST NEVER be prefixed with NEXT_PUBLIC_
const SECRETS_THAT_MUST_NOT_BE_PUBLIC = [
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'DATABASE_URL',
    'RESEND_API_KEY',
    'OPENAI_API_KEY',
    'UPSTASH_REDIS_REST_TOKEN',
    'CLOUDFLARE_TURNSTILE_SECRET_KEY',
    'SENTRY_AUTH_TOKEN',
];

let hasError = false;

console.log('\n🔍 Validating environment variables...\n');

// Check for accidental public secrets
for (const secret of SECRETS_THAT_MUST_NOT_BE_PUBLIC) {
    if (process.env[`NEXT_PUBLIC_${secret}`]) {
        console.error(`  ❌ SECURITY: ${secret} is exposed as NEXT_PUBLIC_${secret}!`);
        console.error(`     → Remove NEXT_PUBLIC_ prefix from secret variables`);
        hasError = true;
    }
}

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
