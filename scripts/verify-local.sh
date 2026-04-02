#!/bin/bash
# scripts/verify-local.sh
# Run via: npm run verify:local
# Comprehensive local setup health check

set -e

echo ""
echo "🔍 Verifying local setup..."
echo "════════════════════════════════════════"
echo ""

# Check env vars
echo "1. Environment variables..."
if npm run env:validate 2>/dev/null; then
  echo "   ✅ All required env vars present"
else
  echo "   ❌ Missing required env vars"
  exit 1
fi

# Check type check
echo ""
echo "2. TypeScript compilation..."
if npm run type-check 2>/dev/null >/dev/null; then
  echo "   ✅ TypeScript compiles successfully"
else
  echo "   ⚠️  TypeScript has errors (continue for diagnostics)"
fi

# Check linting
echo ""
echo "3. ESLint check..."
if npm run lint 2>/dev/null >/dev/null; then
  echo "   ✅ ESLint passes"
else
  echo "   ⚠️  ESLint has warnings (fix with: npm run lint:fix)"
fi

# Check tests
echo ""
echo "4. Jest tests..."
if npm run test:fast 2>/dev/null >/dev/null; then
  echo "   ✅ Tests pass"
else
  echo "   ⚠️  Tests have failures (run: npm run test:watch)"
fi

# Check database
echo ""
echo "5. Database connection..."
if command -v psql >/dev/null 2>&1; then
  if psql "$DATABASE_URL" -c "SELECT 1" 2>/dev/null >/dev/null; then
    echo "   ✅ PostgreSQL is reachable"
  else
    echo "   ⚠️  PostgreSQL not running (run: npm run db:up)"
  fi
else
  echo "   ⚠️  psql not found (install: brew install postgresql or apt get postgresql-client)"
fi

echo ""
echo "════════════════════════════════════════"
echo "✅ Local setup verification complete!"
echo ""
echo "Next: npm run dev:safe"
echo ""
