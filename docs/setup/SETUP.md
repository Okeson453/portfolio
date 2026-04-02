# ⚡ Local Development Setup

**Estimated time: ~20 minutes** | Tested on: macOS 14, Ubuntu 22.04, Windows 11 (WSL2)

---

## Prerequisites

Install these before starting. Each command verifies installation.

| Tool | Min Version | Check | Install |
|------|-------------|-------|---------|
| Node.js | 18.0 | `node --version` | [nodejs.org](https://nodejs.org) |
| npm | 9.0 | `npm --version` | Included with Node |
| Docker | 24.0 | `docker --version` | [docker.com](https://docker.com) |
| Docker Compose | 2.0 | `docker compose version` | Included with Docker |
| Git | 2.40 | `git --version` | [git-scm.com](https://git-scm.com) |

---

## Step 1 — Clone & Install (3 min)

```bash
git clone <repo-url> securestack-portfolio
cd securestack-portfolio
npm install
```

✓ **Success:** Terminal shows "added N packages" with no errors.

---

## Step 2 — Environment Setup (3 min)

```bash
cp .env.example .env.local
npm run setup:env
```

The interactive script will:
- Set required variables (DATABASE_URL, JWT_SECRET, ENCRYPTION_KEY)
- Generate cryptographic secrets automatically
- Mark optional variables clearly

✓ **Success:** `.env.local` exists and `npm run env:validate` exits 0.

---

## Step 3 — Start Database (5 min)

```bash
npm run db:up
```

This command:
1. Starts PostgreSQL and Redis via Docker Compose
2. Waits for health checks to pass
3. Runs Prisma migrations
4. Seeds sample data

✓ **Success:** Terminal shows "✅ Database ready. Seed data inserted."

**Troubleshooting:**
- Port 5432 in use? → `lsof -ti:5432 | xargs kill -9`
- Docker not running? → Open Docker Desktop first
- Slow machine? → Re-run `npm run db:up` (idempotent)

---

## Step 4 — Start Dev Server (1 min)

```bash
npm run dev:safe
```

✓ **Success:** Browser opens to `http://localhost:3000`. No red errors in terminal.

→ `dev:safe` runs TypeScript watch in parallel — type errors appear immediately in your terminal.
→ Use `npm run dev` if you prefer the IDE to handle type checking instead.

---

## Step 5 — Verify Setup (3 min)

```bash
npm run verify:local
```

Checks:
- ✅ TypeScript compiles with 0 errors
- ✅ ESLint passes with 0 warnings
- ✅ Jest unit tests pass
- ✅ Database connection is live
- ✅ Env vars present and valid

✓ **Total setup time: ~15 minutes.**

---

## Daily Development Commands

| Command | When to use |
|---------|-------------|
| `npm run dev:safe` | Normal development (type checking enabled) |
| `npm run dev` | Fast iteration (no type checking, IDE handles it) |
| `npm run test:watch` | While writing or editing tests |
| `npm run test:fast` | Quick sanity check (no coverage, <5s) |
| `npm run lint:fix` | Before committing (auto-fixes most issues) |
| `npm run db:studio` | Browse database with Prisma Studio UI |
| `npm run db:reset` | Reset to clean seed state |

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `connection refused :5432` | PostgreSQL not running | `npm run db:up` |
| `Module not found` | Missing env var | `npm run env:validate` |
| `tsc error after git pull` | Schema changed | `npm run db:migrate` |
| Port 3000 in use | Another server | `lsof -ti:3000 \| xargs kill` |
| Husky hooks not running | Post-install missed | `npm run prepare` |
| Prisma client outdated | Schema drifted | `npx prisma generate` |

---

## Next Steps

- [Development Guidelines](./DEVELOPMENT.md) — code organization & patterns
- [Performance Baseline](./PERFORMANCE.md) — expected performance metrics
- [Contributing Guide](./CONTRIBUTING.md) — PR workflow & code review checklist
