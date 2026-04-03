# Changelog

All notable changes to SecureStack Portfolio will be documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- GitHub Actions CI/CD pipeline (quality gate, E2E, Lighthouse)
- Real unit and E2E test suite
- SECURITY.md vulnerability disclosure policy
- CONTRIBUTING.md developer guide

### Changed
- Consolidated three component directories into single `components/`
- Fixed netlify.toml publish directory and broken redirect
- Extracted security headers into reusable helper in middleware.ts
- Removed invalid CSP referrer directive

### Removed
- AI-generated artifact documentation from root
- Unused dependencies (algoliasearch, socket.io-client, speakeasy, etc.)

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
