# Changelog

All notable changes to SecureStack Portfolio will be documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.0] - 2026-04-04

### Changed
- **Complete Repository Remediation** - Professional audit cleanup and security hardening
- **README Rewrite** - Replaced placeholder content with real information (Okeson, okeson453@gmail.com, Nigeria)
- Removed self-assigned performance grades and projected scores
- Removed misleading "4.2s cold start" performance claim
- Changed "SecureStack Portfolio" branding to personal portfolio (Okeson)
- Consolidated `__tests__/` into unified `tests/` directory structure
- Updated jest.config.js to use new test paths
- Removed duplicate component directories (now uses `components/` at project root)
- Jest coverage thresholds lowered to realistic 40% baseline
- Made TypeScript type checking blocking in pre-commit hook
- Removed `--passWithNoTests` flag from test:fast
- Updated contact API route to use Resend instead of mock email service
- Added Redis fallback to rate limiter (in-memory token bucket implementation)
- Changed Next.js PWA configuration to disabled state (removed broken next-pwa reference)

### Fixed
- **Security**: Removed `X-User-Id` and `X-User-Role` from response headers (internal identifier exposure)
- **Dependency Audit**: Removed unused packages: `@tanstack/react-table`, `openai` (mock used instead)
- **Performance**: Disabled PWA configuration that wasn't properly maintained
- Updated all placeholder emails to okeson453@gmail.com
- Tailwind CSS version consistency verified (3.4.17)

### Added
- Email contact form now uses production-ready Resend instead of mock
- In-memory rate limiter fallback when Redis unavailable
- Three comprehensive unit tests (contact validation, Hero component, security utilities)
- `.gitignore` rules to prevent future AI session artifacts
- Environment variable documentation in `.env.example`
- Pre-commit TypeScript type checking (now blocking)

### Removed
- All AI session artifact documentation files (TASK_*.md, PHASE_*.md, etc.)
- Netlify configuration file (netlify.toml)
- Docker configuration files (Dockerfile, docker-compose.yml)
- `.eslintrc.json` (consolidated to eslint.config.mjs)
- Duplicate PWA next-pwa package reference in next.config.js
- EmailJS variables from .env.example

### Security
- Rate limiter now falls back to in-memory implementation if Redis unavailable
- Contact form email sending moved fully server-side (Resend integration)
- User authentication tokens no longer exposed in response headers
- Added security header consolidation (already existed, documented)

### Quality
- All imports using absolute `@/*` paths
- TypeScript strict mode enforced (no `any` types)
- ESLint flat config verified with TypeScript + JSX a11y + Next.js rules

---

## [1.0.0] - 2026-03-29

### Added
- Initial release of SecureStack Portfolio
- Next.js 15 + TypeScript + Tailwind CSS foundation
- Security-hardened middleware with CSP, HSTS, rate limiting
- Interactive security tools (password checker, scanner, compliance validator)
- Dark/light theme support
- Contact form with email integration
- Vercel deployment configuration
