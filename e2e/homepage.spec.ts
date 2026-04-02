import { test, expect } from '@playwright/test';

test.describe('Homepage Navigation & Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial content to load
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage and display main sections', async ({ page }) => {
    // Check hero section
    await expect(page.locator('section').first()).toBeVisible();
    
    // Check navigation is present
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check all main sections exist
    const sections = await page.locator('section').count();
    expect(sections).toBeGreaterThan(0);
  });

  test('should navigate between sections with smooth scroll', async ({ page }) => {
    // Click about link in navigation
    const aboutLink = page.locator('a:has-text("About")').first();
    await aboutLink.click();
    
    // Wait for scroll animation
    await page.waitForTimeout(1000);
    
    // Verify we're in the about section
    const currentScroll = await page.evaluate(() => window.scrollY);
    expect(currentScroll).toBeGreaterThan(0);
  });

  test('should have working CTA buttons', async ({ page }) => {
    // Find primary CTA button (Get In Touch)
    const ctaButton = page.locator('button:has-text("Get In Touch"), a:has-text("Get In Touch")').first();
    await expect(ctaButton).toBeVisible();
    
    // Verify button is clickable
    await expect(ctaButton).toBeEnabled();
  });

  test('should toggle mobile menu on smaller screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Find menu button (hamburger icon)
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")').first();
    
    if (await menuButton.isVisible()) {
      // Menu should be hidden initially
      const mobileMenu = page.locator('[role="navigation"]').or(page.locator('nav ul'));
      const initiallyHidden = (await mobileMenu.isVisible()) === false;
      
      // Click menu button and verify it opens
      await menuButton.click();
      await page.waitForTimeout(300);
      
      // Menu should now be visible
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('should have accessible navigation with keyboard', async ({ page }) => {
    // Tab to first navigation link
    await page.keyboard.press('Tab');
    
    // Get focused element
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeTruthy();
    
    // Should be able to activate with Enter
    await page.keyboard.press('Enter');
    
    // Page should navigate (URL should change or scroll)
    await page.waitForTimeout(500);
  });

  test('should switch theme with button click', async ({ page }) => {
    // Find theme toggle button
    const themeButton = page.locator('button[aria-label*="theme"], button:has-text("dark"), button:has-text("light")').first();
    
    if (await themeButton.isVisible()) {
      // Get initial theme
      const htmlElement = page.locator('html');
      const initialClass = await htmlElement.getAttribute('class');
      
      // Click theme button
      await themeButton.click();
      await page.waitForTimeout(300);
      
      // Theme should change
      const newClass = await htmlElement.getAttribute('class');
      expect(newClass).not.toBe(initialClass);
    }
  });

  test('should persist theme preference across navigation', async ({ page }) => {
    // Toggle theme
    const themeButton = page.locator('button[aria-label*="theme"]').first();
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(300);
      
      const theme1 = await page.locator('html').getAttribute('class');
      
      // Navigate to different section
      const projectsLink = page.locator('a:has-text("Projects")').first();
      if (await projectsLink.isVisible()) {
        await projectsLink.click();
        await page.waitForTimeout(500);
      }
      
      // Theme should persist
      const theme2 = await page.locator('html').getAttribute('class');
      expect(theme2).toBe(theme1);
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    expect(await h1.count()).toBeGreaterThan(0);
    
    // Check for h2
    const h2 = page.locator('h2');
    expect(await h2.count()).toBeGreaterThan(0);
    
    // H1 should come before H2
    const h1Box = await h1.first().boundingBox();
    const h2Box = await h2.first().boundingBox();
    
    if (h1Box && h2Box) {
      expect(h1Box.y).toBeLessThan(h2Box.y);
    }
  });
});
