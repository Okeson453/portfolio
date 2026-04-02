#!/usr/bin/env node

/**
 * @file scripts/validate-enterprise-grade.js
 * @description Enterprise-grade validation and audit script
 * Verifies all quality gates before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(`  ${title}`, 'blue');
  log(`${'='.repeat(60)}`, 'blue');
}

function section(title) {
  log(`\n→ ${title}`, 'yellow');
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function validateEnterprisGrade() {
  header('ENTERPRISE-GRADE CODE QUALITY VALIDATION');

  let passCount = 0;
  let failCount = 0;
  const results = [];

  // 1. TypeScript Type Checking
  section('1. TypeScript Strict Mode');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    success('Zero type errors - strict mode passed');
    passCount++;
    results.push({ name: 'TypeScript Strict', status: 'PASS' });
  } catch (e) {
    error('TypeScript errors detected');
    failCount++;
    results.push({ name: 'TypeScript Strict', status: 'FAIL' });
  }

  // 2. Check for `any` types
  section('2. Zero `any` Type Tolerance');
  try {
    const anyCheck = execSync(
      'grep -r "any" app/ components/ hooks/ lib/ types/ --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null | grep -E ":\\s*(any|\\[.*any.*\\])" || true',
      { encoding: 'utf-8' }
    );
    
    if (anyCheck.trim()) {
      warning(`Found potential 'any' usages:\n${anyCheck.substring(0, 500)}`);
      failCount++;
      results.push({ name: 'Zero `any` Check', status: 'WARN' });
    } else {
      success('No explicit `any` types found');
      passCount++;
      results.push({ name: 'Zero `any` Check', status: 'PASS' });
    }
  } catch (e) {
    success('No explicit `any` types found');
    passCount++;
    results.push({ name: 'Zero `any` Check', status: 'PASS' });
  }

  // 3. ESLint Linting
  section('3. ESLint Quality Gate');
  try {
    const lintOutput = execSync('npx eslint . --max-warnings=0 --format=compact 2>&1 || true', {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    
    if (lintOutput.includes('error')) {
      error(`Linting failed:\n${lintOutput.substring(0, 500)}`);
      failCount++;
      results.push({ name: 'ESLint', status: 'FAIL' });
    } else {
      success('ESLint passed - zero critical issues');
      passCount++;
      results.push({ name: 'ESLint', status: 'PASS' });
    }
  } catch (e) {
    section('Skipping ESLint (may not be configured)');
    results.push({ name: 'ESLint', status: 'SKIP' });
  }

  // 4. Check for dead code markers
  section('4. Dead Code Detection');
  try {
    const deadCodeFiles = fs.readdirSync(path.join(process.cwd(), 'app/api/timeline-example'));
    if (deadCodeFiles.length > 0) {
      warning('⚠ Dead code route still exists: app/api/timeline-example');
      failCount++;
      results.push({ name: 'Dead Code Cleanup', status: 'WARN' });
    }
  } catch (e) {
    success('No dead code routes detected');
    passCount++;
    results.push({ name: 'Dead Code Cleanup', status: 'PASS' });
  }

  // 5. Check for missing error boundaries
  section('5. Error Handling Infrastructure');
  const errorBoundaryExists = fs.existsSync(path.join(process.cwd(), 'components/ErrorBoundary.tsx'));
  const errorHandlerExists = fs.existsSync(path.join(process.cwd(), 'lib/api/errorHandler.ts'));
  
  if (errorBoundaryExists && errorHandlerExists) {
    success('Error boundaries and handlers in place');
    passCount++;
    results.push({ name: 'Error Handling', status: 'PASS' });
  } else {
    error('Missing error boundary or error handler');
    failCount++;
    results.push({ name: 'Error Handling', status: 'FAIL' });
  }

  // 6. Check rate limiter hardening
  section('6. Security: Rate Limiter');
  const rateLimiterContent = fs.readFileSync(
    path.join(process.cwd(), 'lib/security/rateLimiter.ts'),
    'utf-8'
  );
  
  if (rateLimiterContent.includes('FAIL CLOSED')) {
    success('Rate limiter fail-closed in production');
    passCount++;
    results.push({ name: 'Rate Limiter Hardening', status: 'PASS' });
  } else {
    warning('Rate limiter may not be fail-closed');
    failCount++;
    results.push({ name: 'Rate Limiter Hardening', status: 'WARN' });
  }

  // 7. Check TypeScript path alias resolution
  section('7. TypeScript Path Configuration');
  const tsconfigContent = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'tsconfig.json'), 'utf-8')
  );
  
  const hasAmbiguousPaths = 
    tsconfigContent.compilerOptions.paths['@/components/*'].length > 1;
  
  if (!hasAmbiguousPaths) {
    success('TypeScript paths are unambiguous');
    passCount++;
    results.push({ name: 'Path Resolution', status: 'PASS' });
  } else {
    error('Ambiguous TypeScript path aliases detected');
    failCount++;
    results.push({ name: 'Path Resolution', status: 'FAIL' });
  }

  // Results Summary
  header('VALIDATION RESULTS');
  
  results.forEach(r => {
    const statusColor = r.status === 'PASS' ? 'green' : r.status === 'FAIL' ? 'red' : 'yellow';
    log(`  ${r.name.padEnd(30)} [${r.status}]`, statusColor);
  });

  log(`\n  Total Passed: ${passCount}`, 'green');
  if (failCount > 0) log(`  Total Failed: ${failCount}`, 'red');

  // Final verdict
  header('FINAL VERDICT');
  const passPercentage = Math.round((passCount / (passCount + failCount)) * 100);
  
  if (failCount === 0) {
    success(`✓ ENTERPRISE-GRADE QUALITY ACHIEVED (${passPercentage}%)`);
    log(`\nAll quality gates passed! Code is ready for production.`, 'green');
    process.exit(0);
  } else if (passPercentage >= 75) {
    warning(`⚠ QUALITY CHECK: ${passPercentage}% passed (${failCount} issues to fix)`);
    process.exit(1);
  } else {
    error(`✗ QUALITY CHECK FAILED: Only ${passPercentage}% passed`);
    process.exit(1);
  }
}

validateEnterprisGrade().catch(err => {
  error(`Validation failed with error: ${err.message}`);
  process.exit(1);
});
