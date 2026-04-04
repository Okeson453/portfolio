## Summary
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation
- [ ] Performance improvement
- [ ] Dependency update

## Testing
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes (zero warnings)
- [ ] `npm run test:ci` passes with coverage ≥70%
- [ ] `npm run build` succeeds
- [ ] Tested in Chrome and mobile viewport

## Accessibility
- [ ] New UI components have appropriate ARIA labels
- [ ] Keyboard navigation works for interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)

## Security
- [ ] No secrets committed (.env, API keys, credentials)
- [ ] No new `NEXT_PUBLIC_` variables prefixed secrets
- [ ] Sensitive data encrypted at rest (PII, tokens)
- [ ] Rate limiting applied to new API endpoints
- [ ] Input validation + sanitization via Zod/DOMPurify

## Updates
- [ ] `scripts/validate-env.js` updated (if env validation changes)
- [ ] `SETUP.md` updated (if setup flow changes)
- [ ] `README.md` updated (if feature/docs change)

## Screenshots (if UI changes)
Before / After  
_Paste screenshots here_

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
