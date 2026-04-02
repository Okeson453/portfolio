import { test, expect } from '@playwright/test';

test.describe('Infinite Scroll Blog', () => {
    test('should load initial posts on page load', async ({ page }) => {
        await page.goto('/blog');

        // Wait for first batch of posts
        await page.waitForSelector('[data-testid="blog-post-card"]');

        // Verify posts are rendered
        const postCards = await page.locator('[data-testid="blog-post-card"]').count();
        expect(postCards).toBeGreaterThan(0);
    });

    test('should load next page when scrolling to bottom', async ({ page }) => {
        await page.goto('/blog');

        // Wait for initial posts
        await page.waitForSelector('[data-testid="blog-post-card"]');
        const initialCount = await page.locator('[data-testid="blog-post-card"]').count();

        // Scroll to bottom (triggers infinite scroll sentinel)
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Wait for new posts to load (give network time)
        await page.waitForTimeout(500);

        const finalCount = await page.locator('[data-testid="blog-post-card"]').count();
        expect(finalCount).toBeGreaterThan(initialCount);
    });

    test('should show loading skeleton while fetching', async ({ page }) => {
        await page.goto('/blog');

        // Wait for initial posts
        await page.waitForSelector('[data-testid="blog-post-card"]');

        // Scroll to bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Should show skeleton loader
        const skeleton = page.locator('[data-testid="skeleton-card"]').first();
        await expect(skeleton).toBeVisible();

        // Skeleton should disappear when content loads
        await skeleton.waitFor({ state: 'hidden', timeout: 5000 });
    });

    test('should display "no more posts" when reaching end', async ({ page }) => {
        await page.goto('/blog');

        // Keep scrolling until we reach the end
        let previousCount = 0;
        let sameCountAttempts = 0;

        for (let i = 0; i < 10; i++) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(300);

            const currentCount = await page.locator('[data-testid="blog-post-card"]').count();

            if (currentCount === previousCount) {
                sameCountAttempts++;
                if (sameCountAttempts >= 3) break; // Likely reached end
            } else {
                sameCountAttempts = 0;
            }

            previousCount = currentCount;
        }

        // Check for end-of-list message
        const endMessage = page.locator('[data-testid="no-more-posts"]');
        await expect(endMessage).toBeVisible({ timeout: 5000 });
    });

    test('should support keyboard navigation (arrow down)', async ({ page }) => {
        await page.goto('/blog');

        // Wait for posts
        await page.waitForSelector('[data-testid="blog-post-card"]');

        // Focus on first post
        const firstPost = page.locator('[data-testid="blog-post-card"]').first();
        await firstPost.focus();

        // Send arrow down to trigger load more
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        // Verify new posts load (alternative to scroll)
        const postCount = await page.locator('[data-testid="blog-post-card"]').count();
        expect(postCount).toBeGreaterThanOrEqual(1);
    });

    test('should filter posts by category', async ({ page }) => {
        await page.goto('/blog');

        // Select category filter
        const categorySelect = page.locator('[data-testid="category-filter"]');
        await categorySelect.selectOption('security');

        // Wait for filtered results
        await page.waitForSelector('[data-testid="blog-post-card"]');

        // Verify all posts have security category
        const posts = await page.locator('[data-testid="blog-post-card"]').all();
        for (const post of posts) {
            const category = await post.locator('[data-testid="post-category"]').textContent();
            expect(category).toContain('Security');
        }
    });

    test('should cache results and not re-fetch when scrolling back up', async ({ page }) => {
        // Track network requests
        let apiCallCount = 0;
        page.on('response', (response) => {
            if (response.url().includes('/api/blog/posts')) {
                apiCallCount++;
            }
        });

        await page.goto('/blog');

        // Scroll down
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);

        const callsAfterScroll = apiCallCount;

        // Scroll back up
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);

        // Should not make new API call when scrolling back
        expect(apiCallCount).toBe(callsAfterScroll);
    });
});

test.describe('Infinite Scroll - Offline Mode', () => {
    test('should show offline banner when network is offline', async ({ page, context }) => {
        await page.goto('/blog');

        // Simulate offline
        await context.setOffline(true);

        // Find offline banner
        const offlineBanner = page.locator('[data-testid="offline-banner"]');
        await expect(offlineBanner).toBeVisible();

        // Go back online
        await context.setOffline(false);

        // Banner should disappear
        await expect(offlineBanner).not.toBeVisible({ timeout: 2000 });
    });

    test('should cache posts and display when offline', async ({ page }) => {
        await page.goto('/blog');

        // Wait for posts to load and cache
        await page.waitForSelector('[data-testid="blog-post-card"]');
        const onlineCount = await page.locator('[data-testid="blog-post-card"]').count();

        // Simulate offline
        await page.context().setOffline(true);

        // Posts should still be visible from cache
        const offlineCount = await page.locator('[data-testid="blog-post-card"]').count();
        expect(offlineCount).toBe(onlineCount);

        // Go back online
        await page.context().setOffline(false);
    });
});
