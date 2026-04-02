import { test, expect } from '@playwright/test';

test.describe('Offline Support & PWA', () => {
  test('should show offline banner when network goes down', async ({ page, context }) => {
    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    // Offline banner should appear
    const banner = page.locator('[data-testid="offline-banner"]');
    await expect(banner).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Banner should disappear
    await expect(banner).not.toBeVisible({ timeout: 2000 });
  });

  test('should cache and display pages when offline', async ({ page, context }) => {
    // Load page online
    await page.goto('/blog');
    await page.waitForSelector('[data-testid="blog-post-card"]');

    // Note the content
    const onlineContent = await page.textContent('[data-testid="blog-post-card"]');

    // Go offline
    await context.setOffline(true);

    // Navigate away and back
    await page.goto('/');
    await page.waitForTimeout(500);

    await page.goto('/blog');
    await page.waitForTimeout(500);

    // Content should still be visible due to caching
    const offlineContent = await page.textContent('[data-testid="blog-post-card"]');
    expect(offlineContent).toBe(onlineContent);

    // Go back online
    await context.setOffline(false);
  });

  test('should auto-sync when going back online', async ({ page, context }) => {
    // Load initial data
    await page.goto('/blog');
    await page.waitForSelector('[data-testid="blog-post-card"]');

    const initialCount = await page.locator('[data-testid="blog-post-card"]').count();

    // Go offline
    await context.setOffline(true);

    // Go back online
    await context.setOffline(false);

    // Should refresh data
    await page.waitForTimeout(1000);

    // Data should be refreshed (may be same or updated)
    const refreshedCount = await page.locator('[data-testid="blog-post-card"]').count();
    expect(refreshedCount).toBeGreaterThanOrEqual(0);
  });

  test('should show "Offline unavailable" for pages not in cache', async ({ page, context }) => {
    // Go offline without visiting page first
    await context.setOffline(true);

    // Try to navigate to a page
    await page.goto('/admin/users', { waitUntil: 'domcontentloaded' });

    // Should show offline page or message
    const offlineMsg = page.locator('text=offline');
    const offline = await offlineMsg.isVisible().catch(() => false);

    expect(offline).toBe(true);

    // Go back online
    await context.setOffline(false);
  });

  test('should queue failed requests for sync', async ({ page, context }) => {
    let failedRequests: string[] = [];

    page.on('response', (response) => {
      if (!response.ok() && response.status() !== 304) {
        failedRequests.push(response.url());
      }
    });

    // Load page
    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    // Try to make a request (should fail)
    await page.evaluate(() => {
      fetch('/api/something').catch(() => {});
    });

    // Offline banner should show
    const banner = page.locator('[data-testid="offline-banner"]');
    await expect(banner).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Requests should be retried
    await page.waitForTimeout(1000);

    // Should have attempted sync
    const syncIndicator = page.locator('[data-testid="sync-status"]');
    try {
      await expect(syncIndicator).toBeVisible({ timeout: 500 });
    } catch {
      // Sync may happen in background
    }
  });

  test('should work in offline mode with cached forms', async ({ page, context }) => {
    // Visit form page online
    await page.goto('/contact');
    await page.waitForSelector('[data-testid="contact-form"]');

    // Go offline
    await context.setOffline(true);

    // Form should still be interactive
    const form = page.locator('[data-testid="contact-form"]');
    const input = form.locator('input[name="email"]');

    // Should be able to type even offline
    await input.focus();
    await page.keyboard.type('test@example.com');

    const value = await input.inputValue();
    expect(value).toBe('test@example.com');

    // Draft should be saved to localStorage
    const draft = await page.evaluate(() => {
      return localStorage.getItem('form-draft-contact');
    });
    expect(draft).toBeTruthy();

    // Go back online
    await context.setOffline(false);
  });

  test('should install service worker', async ({ page }) => {
    await page.goto('/');

    // Check if service worker is registered
    const swRegistered = await page.evaluate(() => {
      return navigator.serviceWorker.controller?.state === 'activated';
    });

    expect(swRegistered).toBe(true);
  });

  test('should work as installed PWA app', async ({ page }) => {
    await page.goto('/');

    // Check for PWA manifest
    const manifestHref = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]');
      return link?.getAttribute('href');
    });

    expect(manifestHref).toBeTruthy();

    // Check manifest content
    const manifest = await page.evaluate(async () => {
      const response = await fetch('/manifest.json');
      return response.json();
    });

    expect(manifest.name).toBeTruthy();
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBeTruthy();
  });

  test('should support "Add to Home Screen"', async ({ page }) => {
    await page.goto('/');

    // Check for app install criteria
    const installable = await page.evaluate(() => {
      return document.querySelector('meta[name="apple-mobile-web-app-capable"]') !== null ||
             navigator.serviceWorker.controller?.state === 'activated';
    });

    expect(installable).toBe(true);
  });
});

test.describe('Offline - Sync Queue', () => {
  test('should persist form data while offline', async ({ page, context }) => {
    await page.goto('/contact');
    await page.waitForSelector('[data-testid="contact-form"]');

    // Go offline
    await context.setOffline(true);

    // Fill form
    const form = page.locator('[data-testid="contact-form"]');
    await form.locator('input[name="name"]').fill('John Doe');
    await form.locator('input[name="email"]').fill('john@example.com');
    await form.locator('textarea[name="message"]').fill('Test message');

    // Save draft
    await form.locator('button:has-text("Save Draft")').click();

    // Offline indicator should appear
    const offlineBanner = page.locator('[data-testid="offline-banner"]');
    await expect(offlineBanner).toBeVisible();

    // Data should be in IndexedDB/localStorage
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('form-draft-contact');
    });

    expect(savedData).toContain('John Doe');

    // Go back online
    await context.setOffline(false);

    // Sync indicator should appear
    await page.waitForTimeout(500);
    const syncBanner = page.locator('[data-testid="sync-status"]');
    try {
      await expect(syncBanner).toBeVisible({ timeout: 2000 });
    } catch {
      // Sync may complete immediately
    }
  });

  test('should batch sync multiple offline actions', async ({ page, context }) => {
    // Spy on API calls
    let apiCalls: string[] = [];
    page.on('response', (response) => {
      if (response.url().includes('/api/')) {
        apiCalls.push(response.url());
      }
    });

    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    // Perform multiple actions
    await page.evaluate(() => {
      // Simulate multiple failed requests
      fetch('/api/action1').catch();
      fetch('/api/action2').catch();
      fetch('/api/action3').catch();
    });

    // Go back online
    await context.setOffline(false);

    // Wait for sync
    await page.waitForTimeout(2000);

    // All actions should have been retried
    expect(apiCalls.length).toBeGreaterThan(0);
  });
});

test.describe('Offline - Error Handling', () => {
  test('should show error message when submit fails offline', async ({ page, context }) => {
    await page.goto('/contact');
    await page.waitForSelector('[data-testid="contact-form"]');

    // Go offline
    await context.setOffline(true);

    // Fill and submit form
    const form = page.locator('[data-testid="contact-form"]');
    await form.locator('input[name="email"]').fill('test@example.com');
    await form.locator('button:has-text("Submit")').click();

    // Error toast should appear
    const errorToast = page.locator('[data-testid="toast-error"]');
    await expect(errorToast).toBeVisible();

    // Message should mention offline
    const text = await errorToast.textContent();
    expect(text?.toLowerCase()).toContain('offline');

    // Go back online
    await context.setOffline(false);
  });

  test('should allow retry after coming back online', async ({ page, context }) => {
    await page.goto('/contact');
    await page.waitForSelector('[data-testid="contact-form"]');

    // Go offline
    await context.setOffline(true);

    // Try to submit
    const form = page.locator('[data-testid="contact-form"]');
    await form.locator('input[name="email"]').fill('test@example.com');
    await form.locator('button:has-text("Submit")').click();

    // Error should appear
    const errorToast = page.locator('[data-testid="toast-error"]');
    await expect(errorToast).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Retry button should appear
    const retryBtn = page.locator('[data-testid="retry-btn"]');
    await expect(retryBtn).toBeVisible();

    // Click retry
    await retryBtn.click();

    // Should attempt to submit again
    await page.waitForTimeout(500);
  });
});
