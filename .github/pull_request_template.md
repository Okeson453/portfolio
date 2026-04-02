## Summary
<!-- What does this PR do? Why is it needed? -->

## Changes
<!-- List key changes. Be specific. -->

## Testing
<!-- How did you test this? -->

---

## ✅ Pre-merge Checklist

### Code Quality
- [ ] `npm run type-check` — 0 errors
- [ ] `npm run lint` — 0 warnings
- [ ] `npm run test:fast` — all pass

### If adding a new component
- [ ] Wrapped with `memo()` if props are stable
- [ ] `displayName` set
- [ ] No new `any` types

### If adding an API route
- [ ] Uses `withErrorHandling` wrapper
- [ ] Request body validated with Zod schema
- [ ] Rate limiting applied

### If modifying env vars
- [ ] `.env.example` updated with documentation
- [ ] `scripts/validate-env.js` updated
- [ ] `SETUP.md` updated if setup flow changes

### If modifying database schema
- [ ] Migration created: `npm run db:migrate`
- [ ] Seed data updated if needed
- [ ] Prisma client regenerated

---

## CI Results (auto-populated by Actions)

| Check | Status |
|-------|--------|
| TypeScript | ⏳ |
| ESLint | ⏳ |
| Tests | ⏳ |
| Build | ⏳ |
