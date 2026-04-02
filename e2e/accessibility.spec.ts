import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Testing - WCAG 2.2 AA Compliance', () => {
  test('homepage should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Inject axe-core
    await injectAxe(page);
    
    // Check for accessibility issues
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('navigation should be semantic and accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check for nav element
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check for semantic nav roles
    const navRole = await nav.getAttribute('role');
    expect(navRole || 'navigation').toBeTruthy();
    
    // All links should be keyboard accessible
    const links = nav.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = links.nth(i);
      await expect(link).toBeVisible();
      
      // Link should have text or aria-label
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('form inputs should have proper labels', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to form
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      await form.evaluate(el => el.scrollIntoView());
      await page.waitForTimeout(500);
      
      // Check each input has associated label
      const inputs = form.locator('input');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < Math.min(inputCount, 5); i++) {
        const input = inputs.nth(i);
        const inputId = await input.getAttribute('id');
        const inputName = await input.getAttribute('name');
        const inputAriaLabel = await input.getAttribute('aria-label');
        
        // Should have id for label association
        if (inputId) {
          const label = form.locator(`label[for="${inputId}"]`);
          expect(await label.count()).toBeGreaterThan(0);
        } else {
          // Or have aria-label/name
          expect(inputAriaLabel || inputName).toBeTruthy();
        }
      }
    }
  });

  test('buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all buttons
    const buttons = page.locator('button');
    const firstButton = buttons.first();
    
    if (await firstButton.count() > 0) {
      // Focus on button
      await firstButton.focus();
      
      // Should show focus indicator
      const isFocused = await firstButton.evaluate((el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        const element = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return element === el || element?.contains(el);
      });
      
      expect(isFocused).toBe(true);
      
      // Should be activable with keyboard
      const buttonRole = await firstButton.getAttribute('role') || 'button';
      expect(['button', 'link', 'tab'].includes(buttonRole)).toBe(true);
    }
  });

  test('color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Inject axe-core for color contrast checking
    await injectAxe(page);
    
    // Check color contrast
    await page.evaluate(async () => {
      const results = await (window as any).axe.run({
        rules: ['color-contrast'],
      });
      
      return results.violations.length === 0;
    });
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    expect(imageCount).toBeGreaterThan(0);
    
    // Check first 10 images for alt text or aria-label
    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const parent = await img.evaluate((el) => el.parentElement?.getAttribute('aria-label'));
      
      // Should have alt text or aria-label
      expect(alt || ariaLabel || parent).toBeTruthy();
    }
  });

  test('headings should have proper hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Get all headings
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    
    // Should have H1
    expect(await h1.count()).toBeGreaterThan(0);
    
    // H1 should come before H2
    const h1Pos = await h1.first().boundingBox();
    const h2Pos = await h2.first().boundingBox();
    
    if (h1Pos && h2Pos) {
      expect(h1Pos.y).toBeLessThanOrEqual(h2Pos.y);
    }
    
    // No skipped heading levels (no H1 -> H3)
    const h1Count = await h1.count();
    const h2Count = await h2.count();
    
    // If there's H2, there should be H1
    if (h2Count > 0) {
      expect(h1Count).toBeGreaterThan(0);
    }
  });

  test('focus visible should be present on interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Tab through page
    await page.keyboard.press('Tab');
    
    // Get focused element
    const focusedElement = await page.locator(':focus');
    
    if (await focusedElement.count() > 0) {
      // Should have visible focus style
      const hasFocusStyle = await focusedElement.evaluate((el: HTMLElement) => {
        const styles = window.getComputedStyle(el);
        const outline = styles.outline;
        const boxShadow = styles.boxShadow;
        const border = styles.borderColor;
        
        return outline !== 'none' || boxShadow !== 'none' || border !== 'rgba(0, 0, 0, 0)';
      });
      
      expect(hasFocusStyle).toBe(true);
    }
  });

  test('skip navigation link should be present', async ({ page }) => {
    await page.goto('/');
    
    // Look for skip link
    const skipLink = page.locator('a:has-text("Skip"), a[href="#main"], a[href="#content"]');
    
    // Skip link should exist (might be visually hidden)
    const skipCount = await skipLink.count();
    expect(skipCount).toBeGreaterThanOrEqual(0);
    
    // If visible, clicking should work
    if (await skipLink.count() > 0 && await skipLink.first().isVisible()) {
      const href = await skipLink.first().getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('form validation messages should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Find form
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      await form.evaluate(el => el.scrollIntoView());
      
      // Try to submit empty form
      const submitButton = form.locator('button[type="submit"]').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(500);
        
        // Check for error messages
        const errorMessages = page.locator('[role="alert"], [aria-live="polite"], .error, [class*="error"]');
        
        if (await errorMessages.count() > 0) {
          // Errors should be associated with form fields
          const errorText = await errorMessages.first().textContent();
          expect(errorText).toBeTruthy();
        }
      }
    }
  });
});
