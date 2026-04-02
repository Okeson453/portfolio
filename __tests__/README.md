# Test Directory Structure

```
__tests__/
├── hooks/
│   └── useDebounce.test.ts          # Unit tests for hooks
├── components/
│   └── Modal.test.tsx               # Component tests with React Testing Library
└── e2e/
    ├── infinite-scroll.spec.ts      # Infinite scroll pagination tests
    ├── search.spec.ts               # Debounced search tests
    ├── command-palette.spec.ts      # Cmd+K command palette tests
    ├── offline.spec.ts              # PWA & offline support tests
    ├── drag-drop.spec.ts            # Drag & drop reordering tests
    ├── feature-flags.spec.ts        # Feature flags & A/B testing tests
    ├── advanced-components.spec.ts  # Modals, toasts, virtual scroll
    └── security-accessibility.spec.ts # Security & WCAG 2.2 AAA tests
```

## Test Types by Category

### Unit Tests
- **Location:** `__tests__/hooks/`
- **Framework:** Jest
- **Purpose:** Test individual hooks in isolation
- **Approach:** Mocking dependencies, testing state changes

**Files:**
- `useDebounce.test.ts` - Debounce hook with fake timers

### Component Tests
- **Location:** `__tests__/components/`
- **Framework:** Jest + React Testing Library
- **Purpose:** Test UI component behavior and rendering
- **Approach:** Render component, verify output, simulate interactions

**Files:**
- `Modal.test.tsx` - Modal dialog interactions

### E2E Tests
- **Location:** `__tests__/e2e/`
- **Framework:** Playwright
- **Purpose:** Test complete user workflows
- **Approach:** Navigate pages, interact like real users, verify outcomes

**Files:**
- `infinite-scroll.spec.ts` - Blog pagination (9 tests)
- `search.spec.ts` - Debounced search (15 tests)
- `command-palette.spec.ts` - Cmd+K navigation (12 tests)
- `offline.spec.ts` - Offline PWA features (20 tests)
- `drag-drop.spec.ts` - Reordering interactions (12 tests)
- `feature-flags.spec.ts` - Feature flag management (16 tests)
- `advanced-components.spec.ts` - Modals, toasts, etc (28 tests)
- `security-accessibility.spec.ts` - Security & WCAG 2.2 AAA (24 tests)

---

## Running Tests

### Install Dependencies
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom playwright
```

### Configuration Files
- `jest.config.js` - Jest configuration
- `jest.setup.ts` - Jest setup and globals
- `playwright.config.ts` - Playwright configuration

### Run All Tests
```bash
npm run test                    # Run all tests (unit + component)
npm run test:watch             # Run tests in watch mode
npm run test:e2e               # Run only E2E tests
npm run test:all               # Run unit + component + E2E
npm run test:coverage          # Generate coverage report
```

### Run Specific Tests
```bash
# Run specific test file
npm test -- useDebounce.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should debounce"

# Run E2E tests on specific file
npm run test:e2e -- infinite-scroll.spec.ts

# Run E2E tests matching pattern
npm run test:e2e -- --grep "should load initial posts"
```

### Debug Tests
```bash
# Debug unit tests
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug E2E tests
npm run test:e2e -- --debug

# View browser during E2E test (headed mode)
npm run test:e2e -- --headed

# Slow down E2E test execution
npm run test:e2e -- --slow-mo=1000
```

### Generate Reports
```bash
# HTML coverage report
npm run test:coverage

# E2E HTML report
npm run test:e2e -- --reporter=html
npx playwright show-report

# Coverage badge
npm run test:coverage -- --coverageReporters=lcov
```

---

## Test Coverage by Feature

### 1. Infinite Scroll (9 tests)
✓ Load posts on page load
✓ Scroll to load next page
✓ Show skeleton while loading
✓ Display end-of-list message
✓ Keyboard navigation fallback
✓ Category filtering
✓ Cache results
✓ Show offline banner
✓ Display cached content offline

### 2. Debounced Search (15 tests)
✓ Wait for debounce delay
✓ Fetch after debounce
✓ Highlight matches
✓ Clear results on input clear
✓ Show "no results" message
✓ Loading state
✓ Result count
✓ Result metadata
✓ Navigate to result
✓ Minimum query length
✓ Cache same queries
✓ Keyboard navigation
✓ Open on Enter

### 3. Command Palette (12 tests)
✓ Open with Cmd+K / Ctrl+K
✓ Close with ESC
✓ Filter commands
✓ Navigate and select
✓ Display shortcuts
✓ Arrow key navigation
✓ Enter to execute
✓ No results handling
✓ Focus trap
✓ Case-insensitive search
✓ ARIA labels
✓ Live region announcements

### 4. Drag & Drop (12 tests)
✓ Render sortable items
✓ Drag to new position
✓ Persist changes
✓ Show drag handle
✓ Keyboard reordering
✓ Visual feedback
✓ Placeholder display
✓ Escape to revert
✓ Touch support
✓ Admin-only restriction
✓ ARIA attributes
✓ Keyboard-only support

### 5. Feature Flags (16 tests)
✓ Render when enabled
✓ Hide when disabled
✓ Fetch on app load
✓ Cache in localStorage
✓ Periodic refresh
✓ Apply variants
✓ Track usage
✓ User variant assignment
✓ Admin toggle
✓ Show flag status
✓ Not block rendering
✓ Use cached flags
✓ Fallback on error
✓ Error handling
✓ Consistent variants
✓ Track A/B metrics

### 6. Offline Support (20 tests)
✓ Show offline banner
✓ Cache pages
✓ Display cached content
✓ Auto-sync on reconnect
✓ Unavailable page message
✓ Queue failed requests
✓ Work with cached forms
✓ Service worker installed
✓ PWA manifest present
✓ Add to home screen
✓ Persist form data
✓ Batch sync
✓ Error messages
✓ Retry functionality
✓ Draft auto-save
✓ IndexedDB fallback
✓ Reconnection handling
✓ Offline indicators
✓ Sync status
✓ Retry on reconnect

### 7. Advanced Components (28 tests)
✓ Modal open/close
✓ Focus trap in modal
✓ ESC to close modal
✓ Lock scroll
✓ Success toast notifications
✓ Auto-dismiss toast
✓ Error toast
✓ Manual dismiss
✓ Stack multiple toasts
✓ Virtual list rendering
✓ Load on scroll
✓ Virtual list position
✓ Skeleton loading
✓ Skeleton dimensions
✓ Multi-step form display
✓ Step navigation
✓ Step validation
✓ Progress indicator
✓ Form completion
✓ WebSocket connection
✓ Real-time notifications
✓ Connection loss handling

### 8. Security & Accessibility (24 tests)
✓ CSP header present
✓ Prevent XSS
✓ httpOnly cookies
✓ Secure flag on cookies
✓ X-Frame-Options header
✓ X-Content-Type-Options header
✓ Prevent clickjacking
✓ Sanitize HTML
✓ No sensitive data in storage
✓ CSRF token validation
✓ Semantic HTML
✓ ARIA labels
✓ Keyboard navigation
✓ Color contrast
✓ Image alt text
✓ Form labels
✓ No excessive flashing
✓ Skip links
✓ Heading structure
✓ Screen reader support
✓ Dynamic content announcements
✓ Focus visible
✓ Good LCP
✓ Quick render
✓ Lazy load images
✓ Minimize layout shift
✓ Optimized CSS
✓ Deferred JS

---

## Test Utilities & Helpers

### Common Imports
```typescript
// Jest
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Playwright
import { test, expect } from '@playwright/test';

// Utilities
import { setupServer } from 'msw/node';
import { rest } from 'msw';
```

### Custom Helpers
```typescript
// Mock API responses
const mockBlogPosts = [
  { id: '1', title: 'Post 1', content: '...' },
  { id: '2', title: 'Post 2', content: '...' }
];

// localStorage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
```

### Waiting Patterns
```typescript
// Playwright - Wait for element
await expect(element).toBeVisible();

// Playwright - Wait for condition
await page.waitForFunction(() => 
  document.querySelectorAll('[data-loaded]').length > 0
);

// Jest - Wait for async state
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

---

## Debugging Guide

### Visual Debugging
```bash
# Run Playwright in headed mode
npm run test:e2e -- --headed

# Slow down execution to see interactions
npm run test:e2e -- --slow-mo=2000

# Pause at breakpoint
npm run test:e2e -- --debug
```

### Console Output
```javascript
// Print to console during test
console.log('Debug info:', variable);

// Playwright page structure
await page.pause(); // Pauses and opens dev tools

// Get page state
console.log(await page.content()); // Print HTML
```

### Screenshots & Videos
```bash
# Capture screenshot on failure
npm run test:e2e -- --screenshot=only-on-failure

# Record all test videos
npm run test:e2e -- --video=on
```

---

## Common Issues & Solutions

### Issue: Tests Timeout
```bash
# Increase timeout
npm run test:e2e -- --timeout=60000

# Use debug mode to see where stuck
npm run test:e2e -- --debug
```

### Issue: Flaky Network Tests
```javascript
// Mock network instead of real requests
page.route('**/api/**', route => {
  route.fulfill({ json: mockData });
});
```

### Issue: Element Not Found
```javascript
// Wait longer
await page.waitForSelector('[data-testid="element"]', { timeout: 5000 });

// Or verify it exists
const exists = await page.$('[data-testid="element"]') !== null;
```

### Issue: Focus Tests Failing
```javascript
// Some browsers need native events
await page.keyboard.press('Tab'); // Better than click

// Check if element is focusable
const isFocusable = await element.evaluate(el => !el.disabled);
```

---

## CI/CD Integration

Tests run automatically on:
- ✓ Pull requests
- ✓ Push to main branch
- ✓ Scheduled daily at 2 AM

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:all
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

---

## Performance Metrics

### Test Execution Time
- Unit tests: < 5 seconds
- Component tests: < 10 seconds
- E2E tests: < 5 minutes
- Total suite: < 10 minutes

### Coverage Reports
- Line coverage: ≥ 75%
- Branch coverage: ≥ 70%
- Function coverage: ≥ 80%
- Statement coverage: ≥ 75%

---

## Test Maintenance

### Regular Tasks
- [ ] Review flaky tests weekly
- [ ] Update snapshots on intentional changes
- [ ] Review test coverage monthly
- [ ] Remove obsolete tests
- [ ] Add tests for new features

### Pre-commit Checks
```bash
# Run tests before committing
npm run test -- --bail --onlyChanged
```

---

## Resources

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev/)
- [WCAG 2.2 Testing](https://www.w3.org/WAI/WCAG22/Understanding/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

---

**Test Suite Version:** 1.0
**Last Updated:** 2024
**Maintainer:** Frontend Team
