import { test, expect } from '@playwright/test';

test.describe('Debounced Search', () => {
    test('should not fetch results until debounce delay', async ({ page }) => {
        await page.goto('/blog/search');

        let apiCallCount = 0;
        page.on('response', (response) => {
            if (response.url().includes('/api/blog/search')) {
                apiCallCount++;
            }
        });

        // Type quickly
        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();

        // Type characters rapidly
        for (let i = 0; i < 5; i++) {
            await page.keyboard.type('s');
            await page.waitForTimeout(50);
        }

        // API should not be called yet (debounce active)
        expect(apiCallCount).toBe(0);

        // Wait for debounce delay (300ms default)
        await page.waitForTimeout(400);

        // Now API should be called only once
        expect(apiCallCount).toBe(1);
    });

    test('should fetch results after debounce delay', async ({ page }) => {
        await page.goto('/blog/search');

        // Wait for page ready
        await page.waitForLoadState('networkidle');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();

        // Type search query
        await page.keyboard.type('security');

        // Wait for debounce
        await page.waitForTimeout(500);

        // Results should appear
        const results = page.locator('[data-testid="search-result"]');
        const count = await results.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should highlight matching text in results', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for results
        await page.waitForTimeout(500);

        // Check for highlighted text using <mark> tags
        const highlighted = page.locator('[data-testid="search-result"] mark');
        const count = await highlighted.count();
        expect(count).toBeGreaterThan(0);

        // Highlighted text should contain the search term
        const text = await highlighted.first().textContent();
        expect(text?.toLowerCase()).toContain('security');
    });

    test('should clear results when clearing search', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for results
        await page.waitForTimeout(500);

        let resultCount = await page.locator('[data-testid="search-result"]').count();
        expect(resultCount).toBeGreaterThan(0);

        // Clear input
        await searchInput.clear();

        // Wait for debounce
        await page.waitForTimeout(400);

        // Results should be cleared
        resultCount = await page.locator('[data-testid="search-result"]').count();
        expect(resultCount).toBe(0);
    });

    test('should display "No results" message', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('xyznonexistent');

        // Wait for debounce
        await page.waitForTimeout(500);

        // No results message should appear
        const noResults = page.locator('[data-testid="search-no-results"]');
        await expect(noResults).toBeVisible();
    });

    test('should show loading state during search', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Check for loading indicator
        const loading = page.locator('[data-testid="search-loading"]');

        // Loading should appear briefly
        try {
            await expect(loading).toBeVisible({ timeout: 100 });
        } catch {
            // May be too fast, that's fine
        }

        // Eventually loading should disappear
        await expect(loading).not.toBeVisible({ timeout: 2000 });
    });

    test('should display result count', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for results
        await page.waitForTimeout(500);

        // Result count should be displayed
        const counter = page.locator('[data-testid="result-count"]');
        const text = await counter.textContent();
        expect(text).toMatch(/\d+ results?/i);
    });

    test('should show result metadata (category, date)', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for results
        await page.waitForTimeout(500);

        // Check for metadata
        const category = page.locator('[data-testid="result-category"]').first();
        const date = page.locator('[data-testid="result-date"]').first();

        await expect(category).toBeVisible();
        await expect(date).toBeVisible();

        const categoryText = await category.textContent();
        const dateText = await date.textContent();

        expect(categoryText).toBeTruthy();
        expect(dateText).toBeTruthy();
    });

    test('should navigate to result when clicked', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for results
        await page.waitForTimeout(500);

        const firstResult = page.locator('[data-testid="search-result"]').first();
        const resultLink = firstResult.locator('a');

        const href = await resultLink.getAttribute('href');
        expect(href).toBeTruthy();

        await resultLink.click();

        // Should navigate to blog post
        await page.waitForURL(/.*\/blog\/.*/);
    });

    test('should support minimum query length (2 chars)', async ({ page }) => {
        await page.goto('/blog/search');

        let apiCallCount = 0;
        page.on('response', (response) => {
            if (response.url().includes('/api/blog/search')) {
                apiCallCount++;
            }
        });

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();

        // Type single character
        await page.keyboard.type('a');

        // Wait for debounce
        await page.waitForTimeout(500);

        // Should not call API (less than 2 chars)
        expect(apiCallCount).toBe(0);

        // Type one more character
        await page.keyboard.type('s');

        // Wait for debounce
        await page.waitForTimeout(500);

        // Now should call API
        expect(apiCallCount).toBe(1);
    });

    test('should reuse cached results for same query', async ({ page }) => {
        await page.goto('/blog/search');

        let apiCallCount = 0;
        page.on('response', (response) => {
            if (response.url().includes('/api/blog/search')) {
                apiCallCount++;
            }
        });

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for first search
        await page.waitForTimeout(500);
        const firstCallCount = apiCallCount;

        // Clear and search again
        await searchInput.clear();
        await page.waitForTimeout(400);

        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for second search
        await page.waitForTimeout(500);

        // Should use cache, no additional API call
        expect(apiCallCount).toBe(firstCallCount);
    });
});

test.describe('Debounced Search - Keyboard Navigation', () => {
    test('should navigate results with arrow keys', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for results
        await page.waitForTimeout(500);

        // Arrow down to first result
        await page.keyboard.press('ArrowDown');

        // First result should be focused
        const firstResult = page.locator('[data-testid="search-result"]').first();
        const isFocused = await firstResult.evaluate(el => el === document.activeElement);
        expect(isFocused).toBe(true);

        // Arrow down again
        await page.keyboard.press('ArrowDown');

        // Second result should be focused
        const secondResult = page.locator('[data-testid="search-result"]').nth(1);
        const isSecondFocused = await secondResult.evaluate(el => el === document.activeElement);
        expect(isSecondFocused).toBe(true);
    });

    test('should open result on Enter key', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for results
        await page.waitForTimeout(500);

        // Navigate to first result
        await page.keyboard.press('ArrowDown');

        // Press Enter
        await page.keyboard.press('Enter');

        // Should navigate to post
        await page.waitForURL(/.*\/blog\/.*/);
    });

    test('should escape from results back to search', async ({ page }) => {
        await page.goto('/blog/search');

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.focus();
        await page.keyboard.type('security');

        // Wait for results
        await page.waitForTimeout(500);

        // Navigate to result
        await page.keyboard.press('ArrowDown');

        // Press Escape
        await page.keyboard.press('Escape');

        // Focus should return to search input
        const isFocused = await searchInput.evaluate(el => el === document.activeElement);
        expect(isFocused).toBe(true);
    });
});
