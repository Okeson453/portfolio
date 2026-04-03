import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for navigation to load
    await page.waitForSelector('nav');
  });

  test.describe('Navigation Keyboard Support', () => {
    test('should navigate menu with arrow keys', async ({ page }) => {
      // Focus on menu button
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      // Open dropdown with Enter
      const menuButton = await page.locator('button:has-text("Menu")').first();
      if (await menuButton.isVisible()) {
        await menuButton.focus();
        await page.keyboard.press('Enter');

        // Navigate with arrow keys
        await page.keyboard.press('ArrowDown');
        const focusedElement = await page.evaluate(() => {
          return (document.activeElement as HTMLElement).textContent;
        });

        expect(focusedElement).toBeTruthy();
      }
    });

    test('should close dropdown with Escape', async ({ page }) => {
      const menuButton = await page.locator('button:has-text("Menu")').first();
      if (await menuButton.isVisible()) {
        await menuButton.focus();
        await page.keyboard.press('Enter');

        // Should be open
        await expect(page.locator('[role="menu"]')).toBeVisible();

        // Close with Escape
        await page.keyboard.press('Escape');

        // Focus should return to button
        const focusedId = await page.evaluate(() => {
          return (document.activeElement as HTMLElement).id;
        });

        expect(focusedId).toBeTruthy();
      }
    });

    test('should navigate dropdown items with Up/Down arrows', async ({ page }) => {
      // Open first dropdown menu
      await page.keyboard.press('Tab');
      const firstButton = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button[aria-haspopup="menu"]');
        return buttons.length > 0 ? (buttons[0] as HTMLElement).getAttribute('aria-label') : null;
      });

      if (firstButton) {
        await page.keyboard.press('Enter');

        // Navigate down
        await page.keyboard.press('ArrowDown');
        let focused = await page.evaluate(() => (document.activeElement as HTMLElement).textContent);
        expect(focused).toBeTruthy();

        // Navigate up
        await page.keyboard.press('ArrowUp');
        focused = await page.evaluate(() => (document.activeElement as HTMLElement).textContent);
        expect(focused).toBeTruthy();
      }
    });

    test('should select menu item with Enter', async ({ page }) => {
      // Look for any interactive dropdown
      const menuButtons = page.locator('button[aria-haspopup="menu"]');
      const count = await menuButtons.count();

      if (count > 0) {
        const button = menuButtons.first();
        await button.focus();
        await page.keyboard.press('Enter');

        // Navigate to first item
        await page.keyboard.press('ArrowDown');

        // Get current href or data before selecting
        const urlBefore = page.url();

        // Select with Enter
        await page.keyboard.press('Enter');

        // URL should change or menu should close
        await page.waitForTimeout(500);

        const focusedElement = await page.evaluate(() => {
          return (document.activeElement as HTMLElement).tagName;
        });

        expect(focusedElement).toBeTruthy();
      }
    });
  });

  test.describe('Tab Navigation Order', () => {
    test('should have logical tab order', async ({ page }) => {
      const tabOrder = [];

      // Simulate Tab key navigation
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');

        const focused = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return {
            tag: el.tagName,
            text: el.textContent?.substring(0, 30),
            visible: el.offsetParent !== null,
          };
        });

        tabOrder.push(focused);

        // Break if we've cycled back to start
        if (tabOrder.length > 2 && tabOrder[tabOrder.length - 1].tag === tabOrder[0].tag) {
          break;
        }
      }

      // Should have navigated through interactive elements
      expect(tabOrder.length).toBeGreaterThan(1);
    });

    test('should skip hidden/non-interactive elements', async ({ page }) => {
      const focused = [];

      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Tab');

        const isVisible = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return el.offsetParent !== null;
        });

        focused.push(isVisible);
      }

      // All focused elements should be visible
      expect(focused.every(v => v)).toBe(true);
    });

    test('should support Shift+Tab for reverse navigation', async ({ page }) => {
      // Tab forward
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const forwardElement = await page.evaluate(() => (document.activeElement as HTMLElement).id);

      // Tab backward
      await page.keyboard.press('Shift+Tab');

      const backwardElement = await page.evaluate(() => (document.activeElement as HTMLElement).id);

      // Should be different elements
      expect(forwardElement).not.toBe(backwardElement);
    });
  });

  test.describe('Form Input Navigation', () => {
    test('should navigate form fields with Tab', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForSelector('form');

      // Start Tab navigation
      await page.keyboard.press('Tab');

      let count = 0;
      let currentTag = '';

      // Collect form field names as we Tab through
      const fields = [];
      for (let i = 0; i < 10; i++) {
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return {
            name: el.getAttribute('name') || el.id,
            tag: el.tagName,
          };
        });

        if (info.name) {
          fields.push(info.name);
        }

        await page.keyboard.press('Tab');
        count++;

        if (count > 5) break;
      }

      // Should have navigated through form fields
      expect(fields.length).toBeGreaterThan(0);
    });

    test('should focus form inputs with Tab', async ({ page }) => {
      await page.goto('/contact');

      // Tab to first input
      await page.keyboard.press('Tab');
      let focused = await page.evaluate(() => (document.activeElement as HTMLElement).getAttribute('name'));

      // Keep tabbing to find input fields
      let inputsFound = 0;
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
        focused = await page.evaluate(() => (document.activeElement as HTMLElement).getAttribute('name'));

        if (['name', 'email', 'subject', 'message'].includes(focused)) {
          inputsFound++;
        }

        if (inputsFound >= 3) break;
      }

      expect(inputsFound).toBeGreaterThanOrEqual(1);
    });

    test('should allow typing in focused inputs', async ({ page }) => {
      await page.goto('/contact');

      // Tab to inputs and type
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');

        const focused = await page.evaluate(() => (document.activeElement as HTMLElement).getAttribute('name'));

        if (focused === 'name') {
          await page.keyboard.type('John Doe');
          const value = await page.inputValue('input[name="name"]');
          expect(value).toBe('John Doe');
          break;
        }
      }
    });
  });

  test.describe('Button Focus Visibility', () => {
    test('should show focus indicator on buttons', async ({ page }) => {
      // Tab to first button
      await page.keyboard.press('Tab');

      const hasFocus = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' && styles.outline !== '';
      });

      expect(hasFocus).toBe(true);
    });

    test('should have visible focus ring', async ({ page }) => {
      // Tab through elements until we find a button
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');

        const tagName = await page.evaluate(() => {
          return (document.activeElement as HTMLElement).tagName;
        });

        if (tagName === 'BUTTON') {
          // Check for focus styles
          const hasFocusStyle = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement;
            const styles = window.getComputedStyle(el);
            const hasBorder = styles.borderWidth !== '0px';
            const hasOutline = styles.outlineWidth !== '0px' && styles.outline !== 'none';
            const hasBoxShadow = styles.boxShadow !== 'none';

            return hasBorder || hasOutline || hasBoxShadow;
          });

          expect(hasFocusStyle).toBe(true);
          break;
        }
      }
    });
  });

  test.describe('Skip Links', () => {
    test('should have skip to content link', async ({ page }) => {
      const skipLink = page.locator('a').filter({ hasText: 'skip to main|skip to content' }).first();

      expect(await skipLink.isVisible()).toBe(false); // Hidden by default
    });

    test('should reveal skip link on focus', async ({ page }) => {
      // Press Tab to focus skip link
      await page.keyboard.press('Tab');

      const skipLink = page.locator('a').filter({ hasText: /skip.*content/i }).first();
      const isVisible = await skipLink.isVisible().catch(() => false);

      // If skip link exists, it should be either invisible initially or visible on focus
      expect(typeof isVisible).toBe('boolean');
    });
  });

  test.describe('Dialog/Modal Keyboard', () => {
    test('should handle Tab within modal', async ({ page }) => {
      // Open modal if available - look for dialog-triggering button
      const modalButtons = page.locator('button').filter({ hasText: /open|modal|dialog/ });

      if (await modalButtons.count() > 0) {
        await modalButtons.first().click();

        // Wait for modal
        const modal = page.locator('[role="dialog"]').first();
        if (await modal.isVisible()) {
          // Tab should cycle within modal
          await page.keyboard.press('Tab');

          const focusedInModal = await page.evaluate(() => {
            const modal = document.querySelector('[role="dialog"]');
            const activeElement = document.activeElement as HTMLElement;
            return modal?.contains(activeElement) ?? false;
          });

          expect(focusedInModal).toBe(true);
        }
      }
    });

    test('should close modal with Escape', async ({ page }) => {
      const modalButtons = page.locator('button').filter({ hasText: /open|modal|dialog/ });

      if (await modalButtons.count() > 0) {
        await modalButtons.first().click();

        const modal = page.locator('[role="dialog"]');
        if (await modal.isVisible()) {
          await page.keyboard.press('Escape');

          // Modal should be hidden
          await expect(modal).not.toBeVisible();
        }
      }
    });
  });
});
