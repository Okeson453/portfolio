# Contributing to SecureStack Portfolio

Thanks for considering a contribution.

## Development Setup

```bash
git clone https://github.com/Okeson453/portfolio
cd portfolio
cp .env.example .env.local
npm install
npm run db:up
npm run db:migrate
npm run dev
```

## Before You Submit

Run the full quality gate:

```bash
npm run type-check   # Must pass
npm run lint         # Zero warnings
npm run test:ci      # Must pass with ≥70% coverage
npm run build        # Must succeed
```

## Commit Convention

Use [Conventional Commits](https://conventionalcommits.org):

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code change without new feature
- `docs:` Documentation only
- `chore:` Build, dependencies, config
- `test:` Adding or fixing tests
- `perf:` Performance improvement

## Pull Request Guidelines

- One concern per PR
- Include tests for new functionality
- Update documentation if needed
- Ensure CI passes before requesting review
