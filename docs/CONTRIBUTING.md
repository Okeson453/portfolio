# Contributing

Thank you for interest in contributing! This portfolio is open to contributions.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow

## Before You Start

1. Check existing [Issues](https://github.com/okeson453/portfolio/issues) and [PRs](https://github.com/okeson453/portfolio/pulls)
2. Read [docs/ARCHITECTURE.md](./ARCHITECTURE.md) to understand the structure
3. Read [docs/SECURITY.md](./SECURITY.md) to understand security practices

## Development Workflow

### 1. Fork and Clone

```bash
git clone https://github.com/[your-username]/portfolio.git
cd portfolio
npm install
```

### 2. Create a Branch

Use conventional branch names:

```bash
git checkout -b feat/new-feature
git checkout -b fix/bug-name
git checkout -b docs/update-readme
git checkout -b refactor/component-name
```

### 3. Make Changes

- Follow existing code style
- Make small, logical commits
- Test your changes locally

### 4. Test Before Push

```bash
npm run type-check   # TypeScript type checking
npm run lint         # Code style
npm run test         # Unit tests
npm run build        # Production build
```

### 5. Commit with Conventional Messages

Format: `<type>(<scope>): <subject>`

```bash
git commit -m "feat(contact): add honeypot field to contact form"
git commit -m "fix(auth): correct JWT token expiry validation"
git commit -m "docs(setup): update database setup instructions"
git commit -m "refactor(components): simplify Hero component"
git commit -m "test(auth): add JWT validation tests"
git commit -m "perf(images): optimize hero image size"
git commit -m "ci(github): add lighthouse workflow"
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `ci`, `chore`

### 6. Push and Create PR

```bash
git push origin feat/new-feature
```

Then open a Pull Request on GitHub.

## Pull Request Requirements

Your PR must meet ALL of these before merging:

- [x] Passes CI checks (type-check, lint, test, build)
- [x] Passes code review
- [x] Has a descriptive title
- [x] Has a description of changes
- [x] Links to any related issues
- [x] Updates documentation if needed
- [x] No console.log() statements left in
- [x] TypeScript strict mode compliance
- [x] Tests added (if applicable)

## Code Style

### TypeScript

- Use strict mode (no implicit `any`)
- Prefer `const` over `let`
- Use named exports (not default exports)
- Type function parameters and return types

```typescript
// ✅ Good
export async function getUserById(id: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id } })
  return user
}

// ❌ Bad
export async function getUserById(id) {
  let user = await prisma.user.findOne(id)
  return user
}
```

### React Components

- Use functional components
- Use Server Components by default
- Mark interactive components with `'use client'`
- Avoid prop drilling — use context when needed

```typescript
// ✅ Good (Server Component)
export default async function Profile({ id }: { id: string }) {
  const user = await getUser(id)
  return <UserCard user={user} />
}

// ❌ Bad (unnecessary Client Component)
'use client'
export default function Profile({ id }: { id: string }) {
  const [user, setUser] = useState(null)
  useEffect(() => { fetchUser(id) }, [])
  return <UserCard user={user} />
}
```

### CSS & Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Avoid `!important` — refactor instead

```typescript
// ✅ Good
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Click me
</button>

// ❌ Bad
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
  Click me
</button>
```

## Testing

### Unit Tests

Test business logic and utilities:

```typescript
// tests/unit/utils.test.ts
describe('MyUtil', () => {
  it('should do something', () => {
    expect(myUtil('input')).toBe('expected')
  })
})
```

### Integration Tests

Test API routes and database operations:

```typescript
// tests/integration/api.test.ts
describe('POST /api/contact', () => {
  it('should create a contact message', async () => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'John', email: 'john@example.com' })
    })
    expect(response.status).toBe(201)
  })
})
```

### E2E Tests

Test full user flows with Playwright:

```typescript
// e2e/contact.spec.ts
test('user can submit contact form', async ({ page }) => {
  await page.goto('/')
  await page.fill('[name="name"]', 'John')
  await page.click('button:has-text("Send")')
  await expect(page).toHaveURL('/thank-you')
})
```

## Documentation

- Update `docs/` when adding features
- Keep README.md in sync with reality
- Add JSDoc comments to complex functions
- Link to relevant documentation in commit messages

## Common Scenarios

### Bug Fix

```bash
git checkout -b fix/contact-form-validation
# Make changes
git commit -m "fix(contact): validate email before submission"
# Push and create PR
```

### New Feature

```bash
git checkout -b feat/dark-mode
# Implement feature + tests
git commit -m "feat(theme): add dark mode toggle"
git commit -m "test(theme): add dark mode tests"
# Push and create PR
```

### Documentation Update

```bash
git checkout -b docs/add-setup-guide
# Update or add documentation
git commit -m "docs(setup): add local development guide"
# Push and create PR
```

## Questions?

- Open a GitHub Discussion
- Email: okeson453@gmail.com
- Check existing documentation and issues first

---

**Thank you for contributing!** 🎉
