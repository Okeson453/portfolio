# PHASE 2B: TESTING & COVERAGE IMPLEMENTATION GUIDE

**Target:** Test coverage 45% → 80%+  
**Timeline:** 12 hours  
**Files Created:** 20-30 test files  
**Status:** 🔄 Ready for Implementation

---

## 🎯 COVERAGE TARGETS

### Current Baseline (Phase 1)
```
Statements:   45%
Branches:     38%
Functions:    42%
Lines:        45%
```

### Target (After Phase 2B)
```
Statements:   80%+
Branches:     75%+
Functions:    80%+
Lines:        80%+
```

---

## 🧪 TEST STRUCTURE

### Unit Tests (4 hours) — /tests/unit
Focus on pure functions, utilities, validation logic

### Integration Tests (4 hours) — /tests/integration
Focus on API routes, database interactions, service layer

### E2E Tests (4 hours) — /e2e
Focus on complete user workflows, user interactions

---

## PHASE 2B.1: UNIT TESTS (4 HOURS)

### 1. Form Validation Tests
**File:** `lib/formValidation.test.ts`
**Target Coverage:** 95%+

```typescript
import { validateFormField, validateForm, isFormValid } from '@/lib/formValidation';

describe('Form Validation', () => {
  describe('validateFormField', () => {
    // Name field tests
    test('name: empty string returns error', () => {
      const error = validateFormField('name', '', {});
      expect(error).toBe('Name is required');
    });

    test('name: less than 2 chars returns error', () => {
      const error = validateFormField('name', 'A', {});
      expect(error).toBe('Name must be at least 2 characters');
    });

    test('name: 2+ chars returns no error', () => {
      const error = validateFormField('name', 'John', {});
      expect(error).toBe('');
    });

    test('name: over 100 chars returns error', () => {
      const longName = 'A'.repeat(101);
      const error = validateFormField('name', longName, {});
      expect(error).toBe('Name must be less than 100 characters');
    });

    // Email field tests
    test('email: invalid format returns error', () => {
      const error = validateFormField('email', 'invalid-email', {});
      expect(error).toBe('Please enter a valid email address');
    });

    test('email: valid format returns no error', () => {
      const error = validateFormField('email', 'test@example.com', {});
      expect(error).toBe('');
    });

    // Subject field tests
    test('subject: less than 5 chars returns error', () => {
      const error = validateFormField('subject', 'Hi', {});
      expect(error).toBe('Subject must be at least 5 characters');
    });

    test('subject: valid returns no error', () => {
      const error = validateFormField('subject', 'Hello World', {});
      expect(error).toBe('');
    });

    // Message field tests
    test('message: less than 10 chars returns error', () => {
      const error = validateFormField('message', 'Hi there', {});
      expect(error).toBe('Message must be at least 10 characters');
    });

    test('message: valid returns no error', () => {
      const error = validateFormField('message', 'This is a valid message', {});
      expect(error).toBe('');
    });
  });

  describe('validateForm', () => {
    test('returns no errors for valid form', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Hello',
        message: 'This is a test message',
      };
      const errors = validateForm(formData);
      expect(isFormValid(errors)).toBe(true);
    });

    test('returns errors for invalid form', () => {
      const formData = {
        name: 'J',
        email: 'invalid',
        subject: 'Hi',
        message: 'Short',
      };
      const errors = validateForm(formData);
      expect(isFormValid(errors)).toBe(false);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });

    test('returns multiple errors for multiple invalid fields', () => {
      const formData = {
        name: '',
        email: '',
        subject: '',
        message: '',
      };
      const errors = validateForm(formData);
      expect(Object.keys(errors).length).toBe(4);
    });
  });

  describe('isFormValid', () => {
    test('returns true when no errors', () => {
      const errors = { name: '', email: '', subject: '', message: '' };
      expect(isFormValid(errors)).toBe(true);
    });

    test('returns false when any error exists', () => {
      const errors = { name: 'Error', email: '', subject: '', message: '' };
      expect(isFormValid(errors)).toBe(false);
    });
  });
});
```

### 2. Rate Limiter Unit Tests
**File:** `lib/security/rateLimiter.test.ts`
**Target Coverage:** 95%+

```typescript
import { rateLimit, RATE_LIMIT_CONFIG } from '@/lib/security/rateLimiter';
import { NextRequest } from 'next/server';

describe('Rate Limiter', () => {
  describe('Config', () => {
    test('login: 5 attempts per 10 minutes', () => {
      expect(RATE_LIMIT_CONFIG.login.limit).toBe(5);
      expect(RATE_LIMIT_CONFIG.login.window).toBe(600);
    });

    test('contact: 3 attempts per 5 minutes', () => {
      expect(RATE_LIMIT_CONFIG.contact.limit).toBe(3);
      expect(RATE_LIMIT_CONFIG.contact.window).toBe(300);
    });

    test('api: 100 requests per minute', () => {
      expect(RATE_LIMIT_CONFIG.api.limit).toBe(100);
      expect(RATE_LIMIT_CONFIG.api.window).toBe(60);
    });
  });

  describe('Rate limiting behavior', () => {
    // Note: These tests would require mocking Redis or using an in-memory implementation
    
    test('allows requests under limit', async () => {
      // Mock request
      const req = {
        headers: new Map([['x-forwarded-for', '192.168.1.1']]),
        ip: '192.168.1.1',
      } as unknown as NextRequest;

      // Would test: First request succeeds
      // Expected: success = true
    });

    test('blocks requests over limit', async () => {
      // Would test: 6th request with limit of 5
      // Expected: success = false
    });
  });
});
```

### 3. Schema Generation Tests
**File:** `lib/schema.test.ts`
**Target Coverage:** 100%

```typescript
import {
  generatePersonSchema,
  generateWebsiteSchema,
  generateArticleSchema,
  generateProjectSchema,
} from '@/lib/schema';

describe('Schema Generation', () => {
  describe('generatePersonSchema', () => {
    test('returns valid Person schema', () => {
      const schema = generatePersonSchema();
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Person');
      expect(schema.name).toBeDefined();
      expect(schema.email).toBeDefined();
      expect(schema.jobTitle).toBeDefined();
    });

    test('includes sameAs links', () => {
      const schema = generatePersonSchema();
      expect(Array.isArray(schema.sameAs)).toBe(true);
      expect(schema.sameAs.length).toBeGreaterThan(0);
    });

    test('includes knowsAbout array', () => {
      const schema = generatePersonSchema();
      expect(Array.isArray(schema.knowsAbout)).toBe(true);
      expect(schema.knowsAbout).toContain('Cybersecurity');
    });
  });

  describe('generateArticleSchema', () => {
    const mockPost = {
      title: 'Security Best Practices',
      slug: 'security-best-practices',
      description: 'A guide to security',
      date: '2026-04-01',
      tags: ['security', 'web'],
      author: { name: 'Author Name' },
      category: 'Security',
    };

    test('returns valid TechArticle schema', () => {
      const schema = generateArticleSchema(mockPost);
      expect(schema['@type']).toBe('TechArticle');
      expect(schema.headline).toBe(mockPost.title);
      expect(schema.description).toBe(mockPost.description);
    });

    test('includes author reference to Person', () => {
      const schema = generateArticleSchema(mockPost);
      expect(schema.author['@id']).toMatch(/#person$/);
    });

    test('includes dynamic OG image URL', () => {
      const schema = generateArticleSchema(mockPost);
      expect(schema.image.url).toContain('/api/og');
      expect(schema.image.url).toContain('type=article');
    });
  });
});
```

---

## PHASE 2B.2: INTEGRATION TESTS (4 HOURS)

### 1. Contact API Integration Tests
**File:** `tests/integration/contact-api.test.ts`

```typescript
import { POST } from '@/app/api/contact/route';

describe('Contact API Integration', () => {
  test('POST /api/contact: valid submission saves to DB', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBeDefined();
  });

  test('POST /api/contact: invalid input rejected', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'J', // Too short
        email: 'invalid',
        subject: 'Hi',
        message: 'Short',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  test('POST /api/contact: rate limiting works', async () => {
    // Send 4 requests (should succeed)
    for (let i = 0; i < 3; i++) {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({ /* valid data */ }),
      });
      const response = await POST(request);
      expect(response.status).toBe(201);
    }

    // 4th request should be rate limited (429)
    const limitedRequest = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({ /* valid data */ }),
    });
    const limitedResponse = await limitedRequest;
    expect(limitedResponse.status).toBe(429);
  });
});
```

### 2. OG Image API Integration Tests
**File:** `tests/integration/og-images-api.test.ts`

```typescript
import { GET } from '@/app/api/og/route';

describe('OG Images API Integration', () => {
  test('GET /api/og: returns valid PNG image', async () => {
    const request = new Request(
      'http://localhost:3000/api/og?title=Test&type=article'
    );
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('image/');
  });

  test('GET /api/og: handles all type parameters', async () => {
    for (const type of ['website', 'article', 'project']) {
      const request = new Request(
        `http://localhost:3000/api/og?title=Test&type=${type}`
      );
      const response = await GET(request);
      expect(response.status).toBe(200);
    }
  });

  test('GET /api/og: processes tags parameter', async () => {
    const request = new Request(
      'http://localhost:3000/api/og?title=Test&type=article&tags=security,web'
    );
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  test('GET /api/og: caching headers correct', async () => {
    const request = new Request('http://localhost:3000/api/og?title=Test');
    const response = await GET(request);
    
    // Should have cache headers (from revalidate config)
    expect(response.headers.has('cache-control')).toBe(true);
  });
});
```

---

## PHASE 2B.3: E2E TESTS (4 HOURS)

### 1. Contact Form E2E Test
**File:** `e2e/contact-form.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Contact Form E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('user can submit valid form', async ({ page }) => {
    // Fill form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="subject"]', 'Test Subject');
    await page.fill('textarea[name="message"]', 'This is a test message');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success modal
    await page.waitForSelector('role=status');
    const successText = await page.textContent('role=status');
    expect(successText).toContain('Message Sent Successfully');
  });

  test('shows validation errors', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Name field blurs and shows error
    await page.blur('input[name="name"]');
    const nameError = await page.textContent('[role="alert"]');
    expect(nameError).toContain('Name is required');
  });

  test('clears errors when fixed', async ({ page }) => {
    // Blur empty name field
    await page.focus('input[name="name"]');
    await page.blur('input[name="name"]');

    // Should have error
    let errorText = await page.textContent('[role="alert"]');
    expect(errorText).toContain('required');

    // Type valid name
    await page.fill('input[name="name"]', 'John');

    // Error should be gone
    errorText = await page.textContent('[role="alert"]');
    expect(errorText).not.toContain('required');
  });

  test('allows sending another message after success', async ({ page }) => {
    // Fill and submit
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="subject"]', 'Test');
    await page.fill('textarea[name="message"]', 'This is a test message');
    await page.click('button[type="submit"]');

    // Wait for success modal
    await page.waitForSelector('button:has-text("Send Another Message")');

    // Click "Send Another"
    await page.click('button:has-text("Send Another Message")');

    // Form should be cleared
    const name = await page.inputValue('input[name="name"]');
    expect(name).toBe('');
  });
});
```

### 2. Keyboard Navigation E2E Test
**File:** `e2e/keyboard-navigation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation E2E', () => {
  test('can navigate form with Tab key', async ({ page }) => {
    await page.goto('/contact');

    // Tab to name field
    await page.keyboard.press('Tab');
    expect(await page.locator('input[name="name"]').isVisible()).toBe(true);

    // Tab to email
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // label and input
    expect(await page.locator('input[name="email"]').isFocused()).toBe(true);

    // Continue tabbing
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await page.locator('input[name="subject"]').isFocused()).toBe(true);
  });

  test('can open menu with Enter key', async ({ page }) => {
    await page.goto('/');

    // Focus menu button
    await page.keyboard.press('Tab');

    // Press Enter to open
    await page.keyboard.press('Enter');

    // Menu items should be visible
    const menuItems = page.locator('nav a');
    expect(await menuItems.count()).toBeGreaterThan(0);
  });

  test('can navigate menu with Arrow keys', async ({ page }) => {
    await page.goto('/');

    // Open menu
    const menuButton = page.locator('button[aria-expanded]').first();
    await menuButton.focus();
    await page.keyboard.press('Enter');

    // Navigate with arrow down
    await page.keyboard.press('ArrowDown');
    const firstItem = page.locator('[role="menuitem"]').first();
    expect(await firstItem.isFocused()).toBe(true);

    // Continue with arrow down
    await page.keyboard.press('ArrowDown');
    const secondItem = page.locator('[role="menuitem"]').nth(1);
    expect(await secondItem.isFocused()).toBe(true);
  });

  test('can close menu with Escape', async ({ page }) => {
    await page.goto('/');

    // Open menu
    const menuButton = page.locator('button[aria-expanded]').first();
    await menuButton.focus();
    await page.keyboard.press('Enter');

    // Menu should be open
    let menuVisible = await page.locator('[role="menu"]').isVisible();
    expect(menuVisible).toBe(true);

    // Press Escape
    await page.keyboard.press('Escape');

    // Menu should close and focus return to button
    menuVisible = await page.locator('[role="menu"]').isVisible();
    expect(menuVisible).toBe(false);
    expect(await menuButton.isFocused()).toBe(true);
  });
});
```

---

## ✅ TESTING CHECKLIST

### Setup
- [ ] Jest configured in `jest.config.js`
- [ ] Testing Library configured
- [ ] Playwright configured
- [ ] Test utilities created
- [ ] Mock handlers configured

### Implementation
- [ ] Unit tests written for all utilities
- [ ] Integration tests for all API routes
- [ ] E2E tests for all user flows
- [ ] Coverage reports generated

### Verification
- [ ] All tests pass locally
- [ ] Coverage ≥80% for all categories
- [ ] No test warnings
- [ ] Tests run in CI/CD

---

## 🚀 PHASE 2B COMPLETION

When all tests pass:
```bash
npm test -- --coverage

# Expected output:
# Statements   : 80%+
# Branches     : 75%+
# Functions    : 80%+
# Lines        : 80%+
```

Then proceed to **Phase 2C: SEO Enhancements**

---

Document Created: April 3, 2026  
Version: 1.0 DRAFT  
Status: Ready for Implementation
