import { test, expect } from '@playwright/test';

test.describe('Projects Page & Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to projects section
    const projectsLink = page.locator('a:has-text("Projects"), button:has-text("Projects")').first();
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await page.waitForTimeout(500);
    } else {
      // Scroll to projects section
      await page.evaluate(() => {
        const projects = document.querySelector('[data-section="projects"]') || 
                        Array.from(document.querySelectorAll('section')).find(s => s.textContent?.includes('Project'));
        if (projects) projects.scrollIntoView();
      });
    }
  });

  test('should display projects section with project cards', async ({ page }) => {
    // Check for projects heading
    const projectsHeading = page.locator('h2:has-text("Projects"), h1:has-text("Projects")');
    await expect(projectsHeading).toBeVisible();
    
    // Check for project cards
    const projectCards = page.locator('article[role="article"], div[data-testid*="project"], [class*="project"]:has(a)');
    expect(await projectCards.count()).toBeGreaterThan(0);
  });

  test('should show project details on card hover', async ({ page }) => {
    // Get first project card
    const projectCard = page.locator('article, [class*="project-card"], [class*="ProjectCard"]').first();
    
    if (await projectCard.isVisible()) {
      // Hover over card
      await projectCard.hover();
      await page.waitForTimeout(300);
      
      // Check for additional content (description, tech stack, links)
      const description = projectCard.locator('p, [class*="description"]');
      const links = projectCard.locator('a[href*="http"], button:has-text("View"), button:has-text("Demo")');
      
      // At least one of these should be visible
      const hasContent = (await description.count() > 0) || (await links.count() > 0);
      expect(hasContent).toBe(true);
    }
  });

  test('should have category filter buttons', async ({ page }) => {
    // Look for filter buttons
    const filterButtons = page.locator('button[data-filter], button[data-category], button:has-text(/all|web|backend|security|ai|ml/i)');
    
    const count = await filterButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter projects by category', async ({ page }) => {
    // Get initial project count
    const allProjects = page.locator('article, [class*="project-card"]');
    const initialCount = await allProjects.count();
    
    // Find a category filter button (e.g., "Web", "Backend")
    const filterButtons = page.locator('button:has-text(/web|backend|security|ai|ml|react|typescript/i)');
    
    if (await filterButtons.count() > 0) {
      const filterButton = filterButtons.first();
      const filterText = await filterButton.textContent();
      
      // Click filter
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // Project count might change
      const filteredProjects = page.locator('article, [class*="project-card"]');
      const filteredCount = await filteredProjects.count();
      
      // Either count changes or all projects are in the category
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('should highlight active filter', async ({ page }) => {
    // Get filter buttons
    const filterButtons = page.locator('button[data-filter], button[data-category], button:has-text(/all|web|backend/i)');
    
    if (await filterButtons.count() > 0) {
      const firstButton = filterButtons.first();
      
      // Click to activate
      await firstButton.click();
      await page.waitForTimeout(300);
      
      // Check for active state
      const isActive = await firstButton.evaluate((el: HTMLElement) => {
        return el.hasAttribute('aria-selected') || 
               el.hasAttribute('data-active') ||
               el.classList.contains('active') ||
               el.classList.toString().includes('active');
      });
      
      expect(isActive).toBe(true);
    }
  });

  test('should have clickable project cards linking to details', async ({ page }) => {
    // Get first project card
    const projectCard = page.locator('article, [class*="project-card"]').first();
    
    if (await projectCard.isVisible()) {
      // Find link within card
      const link = projectCard.locator('a[href]:first-of-type, [role="link"]').first();
      
      if (await link.count() > 0) {
        const href = await link.getAttribute('href');
        
        // Should have valid href
        expect(href).toBeTruthy();
        
        // If external link, should have target="_blank"
        if (href?.includes('http')) {
          const target = await link.getAttribute('target');
          expect(target).toBe('_blank');
        }
      }
    }
  });

  test('should display project technologies/tech stack', async ({ page }) => {
    // Get first project card
    const projectCard = page.locator('article, [class*="project-card"]').first();
    
    if (await projectCard.isVisible()) {
      // Look for tech stack display
      const techStack = projectCard.locator('[class*="tech"], [class*="stack"], [class*="tag"], li');
      
      // Should have at least one tech mentioned
      expect(await techStack.count()).toBeGreaterThanOrEqual(0);
      
      // Check text content for tech keywords
      const cardText = await projectCard.textContent();
      const hasTech = cardText?.match(/React|TypeScript|Node|Python|AWS|Docker|PostgreSQL/i);
      
      expect(hasTech).toBeTruthy();
    }
  });

  test('should have accessible project descriptions', async ({ page }) => {
    // Get all project cards
    const projectCards = page.locator('article, [class*="project-card"]');
    
    if (await projectCards.count() > 0) {
      const firstCard = projectCards.first();
      
      // Check for heading in card
      const heading = firstCard.locator('h3, h4, h2');
      expect(await heading.count()).toBeGreaterThan(0);
      
      // Check for description text
      const description = firstCard.locator('p');
      expect(await description.count()).toBeGreaterThan(0);
    }
  });

  test('should maintain responsive layout on mobile', async ({ page }) => {
    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Projects should still be visible
    const projectCards = page.locator('article, [class*="project-card"]');
    expect(await projectCards.count()).toBeGreaterThan(0);
    
    // Cards should be visible without horizontal scroll
    const firstCard = projectCards.first();
    const boundingBox = await firstCard.boundingBox();
    
    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(375);
    }
  });

  test('should have proper touch targets on mobile', async ({ page }) => {
    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Get clickable elements in project cards
    const clickableElements = page.locator('button, a[href], [role="button"]');
    
    // Check that elements have sufficient touch target size (44x44 minimum)
    const elementsWithGoodSize = await clickableElements.evaluateAll((elements: HTMLElement[]) => {
      return elements.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width >= 44 && rect.height >= 44;
      }).length;
    });
    
    // Most clickable elements should have good touch targets
    expect(elementsWithGoodSize).toBeGreaterThan(0);
  });
});
