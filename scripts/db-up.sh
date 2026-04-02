#!/bin/bash
# scripts/db-up.sh
# Run via: npm run db:up
# Idempotent — safe to re-run at any time

set -euo pipefail

echo ""
echo "🐘 Starting database services..."

# Start services
docker compose up -d postgres redis 2>/dev/null || docker-compose up -d postgres redis

# Wait for PostgreSQL health check (up to 30s)
echo "⏳ Waiting for PostgreSQL..."
TIMEOUT=30
ELAPSED=0
until docker compose exec -T postgres pg_isready -U postgres -q 2>/dev/null || docker-compose exec -T postgres pg_isready -U postgres -q 2>/dev/null; do
  sleep 1
  ELAPSED=$((ELAPSED + 1))
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "❌ PostgreSQL did not start within ${TIMEOUT}s."
    echo "   Run: docker compose logs postgres"
    exit 1
  fi
done
echo "✅ PostgreSQL ready."

# Check if Prisma migrations exist
if [ -d "prisma/migrations" ]; then
  # Apply migrations (idempotent — only runs pending migrations)
  echo "🔄 Running migrations..."
  npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init
else
  echo "🔄 No migrations found. Creating initial schema..."
  npx prisma migrate dev --name init
fi

# Seed data (idempotent — checks before inserting)
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
  echo "🌱 Seeding sample data..."
  npx prisma db seed 2>/dev/null || echo "⚠️  Seed script not configured (optional)"
fi

echo ""
echo "✅ Database ready."
echo "   → Browse: npm run db:studio"
echo "   → Reset:  npm run db:reset"
echo ""
