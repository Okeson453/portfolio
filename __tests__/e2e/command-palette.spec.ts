import { test, expect } from '@playwright/test';

test.describe('Command Palette (Cmd+K)', () => {
    test('should open command palette with Cmd+K on Mac', async ({ page, browserName }) => {
        if (browserName === 'webkit') {
            // Only test on webkit which supports Mac shortcuts
            await page.goto('/');

            // Press Cmd+K
            await page.keyboard.press('Meta+k');

            // Command palette should be visible
            const palette = page.locator('[data-testid="command-palette"]');
            await expect(palette).toBeVisible();
        }
    });

    test('should open command palette with Ctrl+K on Windows/Linux', async ({ page }) => {
        await page.goto('/');

        // Press Ctrl+K
        await page.keyboard.press('Control+k');

        // Command palette should be visible
        const palette = page.locator('[data-testid="command-palette"]');
        await expect(palette).toBeVisible();
    });

    test('should close command palette with ESC', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        let palette = page.locator('[data-testid="command-palette"]');
        await expect(palette).toBeVisible();

        // Press ESC
        await page.keyboard.press('Escape');

        // Palette should be hidden
        await expect(palette).not.toBeVisible();
    });

    test('should filter commands by search query', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Type search query
        await page.keyboard.type('blog');

        // Only blog-related commands should be visible
        const blogCommands = page.locator('[data-testid="command-item"]:has-text("Blog")');
        await expect(blogCommands).toHaveCount(1);

        // Other commands should be filtered out
        const allCommands = page.locator('[data-testid="command-item"]');
        const count = await allCommands.count();
        expect(count).toBeLessThanOrEqual(3); // Only filtered results
    });

    test('should navigate on command selection', async ({ page }) => {
        await page.goto('/');

        const currentUrl = page.url();

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Type search
        await page.keyboard.type('projects');

        // Select first command (Projects)
        const firstCommand = page.locator('[data-testid="command-item"]').first();
        await firstCommand.click();

        // Should navigate to projects page
        await page.waitForURL(/.*\/projects/);
        expect(page.url()).not.toBe(currentUrl);
    });

    test('should highlight theme toggle command', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Type theme
        await page.keyboard.type('theme');

        // Theme toggle command should be visible
        const themeCommand = page.locator('[data-testid="command-item"]:has-text("Toggle theme")');
        await expect(themeCommand).toBeVisible();
    });

    test('should display keyboard shortcut hints', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Shortcuts should be visible
        const shortcutHints = page.locator('[data-testid="command-shortcut"]');
        const count = await shortcutHints.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should support arrow key navigation', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Get initial focused item
        let focused = page.locator('[data-testid="command-item"][aria-selected="true"]');
        let initialIndex = await page.locator('[data-testid="command-item"]').indexOf(focused.first());

        // Press arrow down
        await page.keyboard.press('ArrowDown');

        // Focus should move
        focused = page.locator('[data-testid="command-item"][aria-selected="true"]');
        let newIndex = await page.locator('[data-testid="command-item"]').indexOf(focused.first());

        expect(newIndex).toBeGreaterThan(initialIndex);
    });

    test('should support Enter to execute command', async ({ page }) => {
        await page.goto('/');
        const initialUrl = page.url();

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Type command
        await page.keyboard.type('blog');

        // Press enter
        await page.keyboard.press('Enter');

        // Should navigate and close palette
        const palette = page.locator('[data-testid="command-palette"]');
        await expect(palette).not.toBeVisible();

        const newUrl = page.url();
        expect(newUrl).not.toBe(initialUrl);
    });

    test('should show "No commands found" when search has no matches', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Type non-matching query
        await page.keyboard.type('xyznonexist');

        // Should show no results message
        const noResults = page.locator('[data-testid="command-empty"]');
        await expect(noResults).toBeVisible();
    });

    test('should clear search when reopening', async ({ page }) => {
        await page.goto('/');

        // Open palette and search
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');
        await page.keyboard.type('blog');

        // Close
        await page.keyboard.press('Escape');

        // Reopen
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Search field should be empty
        const searchInput = page.locator('[data-testid="command-input"]');
        const value = await searchInput.inputValue();
        expect(value).toBe('');
    });

    test('should maintain focus trap within palette', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Tab through commands
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Focus should still be within palette
        const focused = await page.evaluate(() => {
            const element = document.activeElement as HTMLElement;
            const palette = element?.closest('[data-testid="command-palette"]');
            return !!palette;
        });

        expect(focused).toBe(true);
    });

    test('should match case-insensitive search', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Type lowercase
        await page.keyboard.type('blog');

        const lowerResults = await page.locator('[data-testid="command-item"]').count();

        // Clear and try uppercase
        await page.keyboard.press('Control+a');
        await page.keyboard.type('BLOG');

        const upperResults = await page.locator('[data-testid="command-item"]').count();

        expect(upperResults).toBe(lowerResults);
    });
});

test.describe('Command Palette - Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Check for role and labels
        const palette = page.locator('[data-testid="command-palette"]');
        const role = await palette.getAttribute('role');
        expect(role).toBe('dialog');

        // Input should have label or aria-label
        const input = page.locator('[data-testid="command-input"]');
        const ariaLabel = await input.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
    });

    test('should announce new results to screen readers', async ({ page }) => {
        await page.goto('/');

        // Open palette
        await page.keyboard.press('Control+k');
        await page.waitForSelector('[data-testid="command-palette"]');

        // Type search
        await page.keyboard.type('blog');

        // Results container should have aria-live
        const results = page.locator('[data-testid="command-list"]');
        const ariaLive = await results.getAttribute('aria-live');
        expect(['polite', 'assertive']).toContain(ariaLive);
    });
});
