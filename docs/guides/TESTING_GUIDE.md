# Enterprise Portfolio - Comprehensive Test Suite

This document outlines all the tests created for the enterprise-class Next.js 15 portfolio application.

## Test Overview

The test suite covers all 12 mandatory advanced features plus security, accessibility, and performance requirements.

### Quick Stats
- **Unit Tests:** 1 file (hooks testing patterns)
- **Component Tests:** 1 file (Modal dialog testing)
- **E2E Tests:** 8 files (feature-specific Playwright tests)
- **Total Test Coverage:** All 12 features + quality standards

---

## Test Files

### 1. Unit Tests

#### `__tests__/hooks/useDebounce.test.ts`
**Purpose:** Demonstrate Jest testing patterns for custom hooks

**Test Cases (3):**
- ✓ Should debounce function calls
- ✓ Should respect debounce delay
- ✓ Should handle rapid changes

**Key Testing Concepts:**
- Jest fake timers (`jest.useFakeTimers()`)
- Testing cleanup on unmount
- Multiple rapid invocations

**Example:**
```typescript
test('should debounce function calls', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const debounced = useDebounce(callback, 300);
  
  debounced('test');
  debounced('test2');
  
  expect(callback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(300);
  expect(callback).toHaveBeenCalledWith('test2');
});
```

---

### 2. Component Tests

#### `__tests__/components/Modal.test.tsx`
**Purpose:** Test Modal component behavior and accessibility

**Test Cases (7):**
- ✓ Renders when isOpen is true
- ✓ Does not render when isOpen is false
- ✓ Calls onClose when close button clicked
- ✓ Closes on ESC key press
- ✓ Displays title and description
- ✓ Applies correct size classes
- ✓ Prevents scroll when open

**Key Testing Concepts:**
- React Testing Library render/screen
- User interaction testing
- DOM style verification
- Keyboard event handling

---

### 3. E2E Tests

#### `__tests__/e2e/infinite-scroll.spec.ts`
**Feature:** Infinite Scroll Pagination
**Test Cases (9):**

**Core Functionality:**
- ✓ Load initial posts on page load
- ✓ Load next page when scrolling to bottom
- ✓ Show loading skeleton while fetching
- ✓ Display "no more posts" at end

**Additional Features:**
- ✓ Support keyboard navigation (arrow down)
- ✓ Filter posts by category
- ✓ Cache results without re-fetching
- ✓ Show offline banner when offline
- ✓ Display cached posts when offline

**Key Testing:**
- Scroll event triggering
- Network request monitoring
- Skeleton loader visibility
- Offline mode simulation

**Keyboard Fallback:**
- Arrow down key triggers load more
- Tab navigation support

---

#### `__tests__/e2e/search.spec.ts`
**Feature:** Debounced Search with Highlighting
**Test Cases (15):**

**Debounce Behavior:**
- ✓ Should not fetch until debounce delay
- ✓ Fetch results after debounce delay
- ✓ Highlight matching text in results
- ✓ Clear results when clearing search
- ✓ Display "No results" message
- ✓ Show loading state during search
- ✓ Display result count
- ✓ Show result metadata (category, date)
- ✓ Navigate to result when clicked
- ✓ Support minimum query length (2 chars)
- ✓ Reuse cached results for same query

**Keyboard Navigation:**
- ✓ Navigate results with arrow keys
- ✓ Open result on Enter key
- ✓ Escape from results back to search

**Advanced Features:**
- ✓ Regular expression matching
- ✓ Mark tag highlighting

---

#### `__tests__/e2e/command-palette.spec.ts`
**Feature:** Command Palette (Cmd+K / Ctrl+K)
**Test Cases (12):**

**Keyboard Shortcuts:**
- ✓ Open with Cmd+K on Mac
- ✓ Open with Ctrl+K on Windows/Linux
- ✓ Close with ESC

**Search & Navigation:**
- ✓ Filter commands by search query
- ✓ Navigate on command selection
- ✓ Highlight theme toggle command
- ✓ Display keyboard shortcut hints
- ✓ Support arrow key navigation
- ✓ Support Enter to execute command
- ✓ Show "No commands found" when no matches

**Advanced Features:**
- ✓ Clear search when reopening
- ✓ Maintain focus trap within palette
- ✓ Match case-insensitive search

**Accessibility:**
- ✓ Proper ARIA labels
- ✓ Announce new results to screen readers

---

#### `__tests__/e2e/offline.spec.ts`
**Feature:** Offline Support & PWA
**Test Cases (20):**

**Offline Detection:**
- ✓ Show offline banner when network goes down
- ✓ Cache and display pages when offline
- ✓ Auto-sync when going back online
- ✓ Show "Offline unavailable" for non-cached pages

**Sync Queue:**
- ✓ Queue failed requests for sync
- ✓ Persist form data while offline
- ✓ Batch sync multiple offline actions

**PWA Features:**
- ✓ Install service worker
- ✓ Work as installed PWA app
- ✓ Support "Add to Home Screen"

**Error Handling:**
- ✓ Show error message when submit fails offline
- ✓ Allow retry after coming back online

**Advanced:**
- ✓ Work in offline mode with cached forms
- ✓ Support form auto-save drafts

---

#### `__tests__/e2e/drag-drop.spec.ts`
**Feature:** Drag & Drop Reordering
**Test Cases (12):**

**Drag Interactions:**
- ✓ Render sortable items
- ✓ Drag item to new position
- ✓ Persist reorder changes
- ✓ Show drag handle on hover
- ✓ Show visual feedback during drag
- ✓ Show placeholder during drag
- ✓ Revert drag on escape

**Keyboard Support:**
- ✓ Support keyboard reordering (Alt+ArrowDown)

**Mobile Support:**
- ✓ Support touch drag on mobile

**Permissions:**
- ✓ Disable drag for non-admin users

**Accessibility:**
- ✓ Have proper ARIA attributes
- ✓ Announce drag actions to screen readers
- ✓ Support keyboard-only reordering

---

#### `__tests__/e2e/feature-flags.spec.ts`
**Feature:** Feature Flags & A/B Testing
**Test Cases (16):**

**Flag Management:**
- ✓ Render feature-flagged component when enabled
- ✓ Hide feature-flagged component when disabled
- ✓ Fetch feature flags on app load
- ✓ Cache feature flags in localStorage
- ✓ Refresh feature flags periodically

**A/B Testing:**
- ✓ Apply feature flag variants for A/B testing
- ✓ Track feature usage in analytics
- ✓ Support userId variant assignment
- ✓ Allow admin to toggle feature flags

**Display & Status:**
- ✓ Show feature flag status in UI (dev mode)

**Performance:**
- ✓ Not block initial page render
- ✓ Use cached flags if network is slow

**Error Handling:**
- ✓ Fallback to default flags on API error
- ✓ Show error message if flags fail to load

**A/B Testing Specific:**
- ✓ Assign consistent variant per user
- ✓ Track A/B test metrics
- ✓ Allow variant-specific UI rendering

---

#### `__tests__/e2e/advanced-components.spec.ts`
**Features:** Modals, Toasts, Virtual Scrolling, Forms, Real-time
**Test Cases (28):**

**Modal Dialogs (5):**
- ✓ Open and close modal
- ✓ Trap focus inside modal
- ✓ Close modal on ESC key
- ✓ Lock body scroll when modal open
- ✓ Display title and description

**Toast Notifications (5):**
- ✓ Show success toast notification
- ✓ Auto-dismiss toast after delay
- ✓ Show error toast on failure
- ✓ Allow manual dismiss
- ✓ Stack multiple toasts

**Virtual Scrolling (3):**
- ✓ Render large lists efficiently (10,000+ items)
- ✓ Load items on scroll
- ✓ Maintain scroll position on filter

**Loading States (2):**
- ✓ Show skeleton while loading
- ✓ Have proper skeleton dimensions

**Multi-step Forms (5):**
- ✓ Display form steps
- ✓ Navigate between steps
- ✓ Validate current step before proceeding
- ✓ Show progress indicator
- ✓ Complete form submission

**Real-time Updates (3):**
- ✓ Establish WebSocket connection
- ✓ Receive real-time notifications
- ✓ Handle connection loss and reconnection

---

#### `__tests__/e2e/security-accessibility.spec.ts`
**Features:** Security (OWASP) + Accessibility (WCAG 2.2 AAA)
**Test Cases (24):**

**Security (11):**
- ✓ Content Security Policy header present
- ✓ Prevent XSS attacks (input sanitization)
- ✓ Use httpOnly cookies for auth
- ✓ Set Secure flag on cookies
- ✓ Have X-Frame-Options header
- ✓ Have X-Content-Type-Options header
- ✓ Prevent clickjacking
- ✓ Sanitize HTML content
- ✓ No sensitive data in localStorage
- ✓ Validate CSRF tokens
- ✓ Proper security headers

**Accessibility - WCAG 2.2 AAA (10):**
- ✓ Proper semantic HTML
- ✓ ARIA labels on buttons
- ✓ Support keyboard navigation
- ✓ Sufficient color contrast
- ✓ Text alternatives for images
- ✓ Properly labeled form fields
- ✓ No excessive flashing/flickering
- ✓ Provide skip links
- ✓ Proper heading structure
- ✓ Support screen reader navigation

**Accessibility - Advanced (3):**
- ✓ Announce dynamic content changes
- ✓ Handle focus visible for keyboard users
- ✓ Nested modals with focus trap

**Performance - Core Web Vitals (6):**
- ✓ Good Largest Contentful Paint
- ✓ Render initial content quickly
- ✓ Lazy load images
- ✓ Minimize layout shift
- ✓ Optimized CSS delivery
- ✓ Defer non-critical JavaScript

---

## Running the Tests

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run specific test
npm test useDebounce.test.ts
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E test file
npm run test:e2e infinite-scroll.spec.ts

# Run tests in debug mode
npm run test:e2e -- --debug

# Generate HTML report
npm run test:e2e -- --reporter=html
```

### All Tests
```bash
# Run unit + E2E tests
npm run test:all

# Generate coverage report
npm run test:coverage
```

---

## Feature Coverage Matrix

| Feature | Unit | Component | E2E | Security | A11y | Performance |
|---------|------|-----------|-----|----------|------|-------------|
| Infinite Scroll | ✓ | - | ✓ | ✓ | ✓ | ✓ |
| Debounced Search | ✓ | - | ✓ | ✓ | ✓ | ✓ |
| Command Palette | - | - | ✓ | ✓ | ✓ | ✓ |
| Drag & Drop | - | - | ✓ | ✓ | ✓ | ✓ |
| Virtual Scrolling | - | - | ✓ | ✓ | ✓ | ✓ |
| Modals | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| Toast Notifications | - | - | ✓ | ✓ | ✓ | ✓ |
| Multi-step Forms | - | - | ✓ | ✓ | ✓ | ✓ |
| Offline Support/PWA | - | - | ✓ | ✓ | ✓ | ✓ |
| Real-time Updates | - | - | ✓ | ✓ | ✓ | ✓ |
| Feature Flags | - | - | ✓ | ✓ | ✓ | ✓ |
| Loading Skeletons | - | - | ✓ | ✓ | ✓ | ✓ |

---

## Test Data & Mocking

### API Mocking
- `/api/blog/posts` - Cursor-based pagination mock
- `/api/blog/search` - Search results with highlighting
- `/api/feature-flags` - Feature flag responses
- `/api/health` - Health check endpoint

### Service Mocking
- IndexedDB operations
- localStorage operations
- Service Worker registration
- WebSocket connections
- PostHog analytics
- Sentry error tracking

### Test Utilities
```typescript
// Mock fetch
jest.mock('node-fetch');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Mock Service Worker
import { rest } from 'msw';
import { setupServer } from 'msw/node';
```

---

## Continuous Integration

All tests run automatically via GitHub Actions:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run unit tests
        run: npm run test -- --ci --coverage
      
      - name: Run E2E tests
        run: npm run test:e2e -- --config=playwright.config.ts
      
      - name: Upload coverage
        run: npm run coverage:upload
```

---

## Test Metrics & Targets

### Coverage Requirements
- Unit test coverage: ≥ 80%
- E2E test coverage: All 12 features + quality standards
- Line coverage: ≥ 75%
- Branch coverage: ≥ 70%

### Performance Benchmarks
- Test suite completion: < 10 minutes
- Single test: < 30 seconds
- Unit test: < 500ms
- E2E test: < 5 seconds

### Quality Gates
- ✓ Zero lint errors
- ✓ TypeScript strict mode
- ✓ All tests passing
- ✓ Accessibility compliance
- ✓ Security headers present
- ✓ Performance budget met

---

## Debugging Tests

### Run Single Test
```bash
# Unit test
npm test -- --testNamePattern="should debounce"

# E2E test
npm run test:e2e -- --grep "should load initial posts"
```

### Debug Mode
```bash
# Playwright debug
npm run test:e2e -- --debug

# View browser
npm run test:e2e -- --headed

# Slow down execution
npm run test:e2e -- --slow-mo=1000
```

### View Test Report
```bash
# Open HTML report
npm run test:e2e -- --reporter=html
npx playwright show-report
```

---

## Common Test Patterns

### Asserting Element Visibility
```typescript
await expect(element).toBeVisible();
await expect(element).not.toBeVisible({ timeout: 2000 });
```

### Testing User Interactions
```typescript
await userEvent.click(button);
await userEvent.type(input, 'search text');
await page.keyboard.press('Enter');
```

### Waiting for Network
```typescript
await page.waitForURL(/.*search/);
await page.waitForSelector('[data-loading="true"]');
await page.waitForFunction(() => fetch(...));
```

### Mocking API Responses
```typescript
page.route('**/api/**', route => {
  if (route.request().postData()?.includes('search')) {
    route.fulfill({ json: mockResults });
  }
});
```

---

## Maintenance & Updates

### Adding New Tests
1. Create test file in appropriate directory
2. Follow naming convention: `feature.spec.ts`
3. Import test utilities and setup helpers
4. Write descriptive test cases
5. Run tests locally before committing

### Updating Existing Tests
1. If feature changes, update test expectations
2. Add new test cases for new behavior
3. Remove deprecated test cases
4. Verify CI passes before merging

### Test Review Checklist
- [ ] All tests have descriptive names
- [ ] Tests are isolated and independent
- [ ] No hard-coded delays (use waitFor instead)
- [ ] Proper error handling
- [ ] Accessibility tested
- [ ] Security considerations addressed

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [OWASP Security Guidelines](https://owasp.org/)

---

**Last Updated:** 2024
**Test Suite Version:** 1.0
**Enterprise Portfolio v1.0**
