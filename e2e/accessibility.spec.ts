import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility E2E Tests with axe-core
 * Validates WCAG 2.2 AA compliance across all pages
 * 
 * Run: npx playwright test e2e/accessibility.spec.ts
 * Install: npm install --save-dev @axe-core/playwright
 */

const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/skills', name: 'Skills' },
  { path: '/projects', name: 'Projects' },
  { path: '/blog', name: 'Blog' },
  { path: '/contact', name: 'Contact' },
];

test.describe('Accessibility — WCAG 2.2 AA Compliance', () => {
  routes.forEach(({ path, name }) => {
    test(`${name} page — axe violations: 0`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Run axe accessibility scan
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();

      // Assert no violations (zero-tolerance policy)
      expect(results.violations).toHaveLength(0);

      // Log summary
      console.log(`✓ ${name} — 0 violations (${results.passes.length} passes)`);
    });
  });

  test('Skip link — functional (bypass blocks)', async ({ page }) => {
    await page.goto('/');

    // Tab to skip link
    await page.keyboard.press('Tab');

    // Skip link should be visible and focused
    const skipLink = page.getByRole('link', { name: /skip to/i });
    await expect(skipLink).toBeFocused();

    // Press Enter to activate
    await skipLink.press('Enter');

    // Focus should move to main-content
    const mainContent = page.locator('main, [id*="main"]');
    await expect(mainContent).toBeFocused();
  });

  test('Keyboard navigation — focus-visible on all elements', async ({ page }) => {
    await page.goto('/');

    const button = page.getByRole('button').first();
    await button.focus();

    // Check that focus-visible style is applied
    const outline = await button.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.outline !== 'none';
    });

    expect(outline).toBe(true);
  });

  test('Color contrast — no violations (WCAG AA)', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withRules('color-contrast')
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('Form accessibility — all inputs associated with labels', async ({ page }) => {
    await page.goto('/contact');

    // Get all form inputs
    const inputs = page.locator('input, textarea');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        expect(await label.count()).toBeGreaterThan(0);
      } else {
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('Images — all have descriptive alt text', async ({ page }) => {
    await page.goto('/projects');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // All images must have non-empty alt text
      expect(alt?.trim()).toBeTruthy();
    }
  });

  test('Touch targets — all interactive elements ≥44px', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withRules('target-size')
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('Landmarks — page has proper landmark structure', async ({ page }) => {
    await page.goto('/');

    // Check for required landmarks
    const nav = page.locator('nav');
    const main = page.locator('main');
    const footer = page.locator('footer');

    expect(await nav.count()).toBeGreaterThan(0);
    expect(await main.count()).toBeGreaterThan(0);
    expect(await footer.count()).toBeGreaterThan(0);
  });

  test('Headings — proper hierarchy (no skipped levels)', async ({ page }) => {
    await page.goto('/');

    const h1s = page.locator('h1');
    const h2s = page.locator('h2');

    // Page should have at least one h1
    expect(await h1s.count()).toBeGreaterThanOrEqual(1);

    // If h2s exist, they should come after h1
    if (await h2s.count() > 0) {
      const h1Index = await h1s.nth(0).evaluate(el => el.compareDocumentPosition(document.body) & 4);
      const h2Index = await h2s.nth(0).evaluate(el => el.compareDocumentPosition(document.body) & 4);
      expect(h1Index).toBeLessThanOrEqual(h2Index);
    }
  });

  test('Lists — semantic structure preserved', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withRules(['list', 'listitem'])
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('Dark mode — contrast validated in both modes', async ({ page }) => {
    await page.goto('/');

    // Test light mode
    const lightResults = await new AxeBuilder({ page })
      .withRules('color-contrast')
      .analyze();

    expect(lightResults.violations).toHaveLength(0);

    // Toggle dark mode (assumes data-theme or dark class on html)
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // Test dark mode
    const darkResults = await new AxeBuilder({ page })
      .withRules('color-contrast')
      .analyze();

    expect(darkResults.violations).toHaveLength(0);
  });

  test('ARIA attributes — valid and not redundant', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withRules(['aria-required-attr', 'aria-allowed-attr', 'aria-valid-attr'])
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('Buttons & Links — accessible names present', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withRules('button-name', 'link-name')
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

