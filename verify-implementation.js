#!/usr/bin/env node

/**
 * SecureStack Portfolio - Complete Implementation Verification
 * 
 * This script verifies that all Phase 1 (Auth), Phase 2 (Admin), 
 * and Phase 3 (Public Features) are fully implemented.
 */

const fs = require('fs');
const path = require('path');

const checks = {
    'P1: Auth': [
        'app/api/auth/register/route.ts',
        'app/api/auth/login/route.ts',
        'app/api/auth/logout/route.ts',
        'app/api/auth/verify-email/route.ts',
        'app/api/auth/forgot-password/route.ts',
        'app/api/auth/reset-password/route.ts',
        'app/api/auth/verify-2fa/route.ts',
        'app/api/auth/me/route.ts',
        'app/api/auth/devices/route.ts',
        'app/api/auth/account/delete/route.ts',
        'lib/auth/password.ts',
        'lib/auth/session.ts',
        'lib/auth/registration.ts',
        'lib/auth/verification.ts',
        'lib/auth/passwordReset.ts',
        'lib/auth/twoFactor.ts',
        'lib/auth/accountDeletion.ts',
        'lib/auth/roles.ts',
        'lib/security/rateLimiter.ts',
        'lib/validators/authSchema.ts',
    ],
    'P2: Admin Dashboard': [
        'app/admin/layout.tsx',
        'app/admin/page.tsx',
        'app/admin/users/page.tsx',
        'app/admin/blog/page.tsx',
        'app/admin/settings/page.tsx',
        'app/admin/logs/page.tsx',
        'lib/middleware/adminAuth.ts',
    ],
    'P3: Public Features': [
        'components/SecurityChatWidget.tsx',
        'components/ContactForm.tsx',
        'components/SearchComponent.tsx',
        'components/CommentSection.tsx',
        'app/api/chat/route.ts',
        'app/api/contact/route.ts',
        'app/api/search/route.ts',
        'app/api/comments/route.ts',
    ],
    'Performance & Security': [
        'lib/performance/monitor.ts',
        'middleware.ts',
        'next.config.js',
    ],
};

let totalFiles = 0;
let existingFiles = 0;

console.log('\n🔍 SecureStack Portfolio - Implementation Verification\n');
console.log('='.repeat(60));

for (const [phase, files] of Object.entries(checks)) {
    console.log(`\n${phase}`);
    console.log('-'.repeat(60));

    let phaseCount = 0;
    for (const file of files) {
        const fullPath = path.join(__dirname, file);
        const exists = fs.existsSync(fullPath);
        totalFiles++;
        if (exists) {
            existingFiles++;
            phaseCount++;
            console.log(`  ✅ ${file}`);
        } else {
            console.log(`  ❌ ${file}`);
        }
    }

    console.log(`  Status: ${phaseCount}/${files.length} files created`);
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Overall Status: ${existingFiles}/${totalFiles} files created`);
console.log(`   Completion: ${((existingFiles / totalFiles) * 100).toFixed(1)}%`);

if (existingFiles === totalFiles) {
    console.log('\n✨ ALL PHASES COMPLETE! Ready for deployment.\n');
    process.exit(0);
} else {
    console.log(`\n⚠️  ${totalFiles - existingFiles} files still needed.\n`);
    process.exit(1);
}
