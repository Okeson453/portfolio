import { test, expect } from '@playwright/test';

test.describe('Contact Form Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to contact form and display required fields', async ({ page }) => {
    // Click CTA button or scroll to contact form
    const ctaButton = page.locator('button:has-text("Get In Touch"), a:has-text("Contact")').first();
    
    // If button exists, click it; otherwise scroll to contact section
    if (await ctaButton.isVisible()) {
      await ctaButton.click();
    } else {
      await page.evaluate(() => {
        const contact = document.querySelector('form') || document.querySelector('[data-section="contact"]');
        if (contact) contact.scrollIntoView();
      });
    }
    
    await page.waitForTimeout(500);
    
    // Verify contact form exists
    const contactForm = page.locator('form').first();
    await expect(contactForm).toBeVisible();
    
    // Check for required fields
    const nameInput = page.locator('input[name*="name" i], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[name*="email" i], input[type="email"]').first();
    const messageInput = page.locator('textarea[name*="message" i], textarea[placeholder*="message" i]').first();
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
  });

  test('should show validation error for empty required fields', async ({ page }) => {
    // Scroll to contact form
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.scrollIntoView();
    });
    
    await page.waitForTimeout(500);
    
    // Find submit button
    const submitButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    
    // Try to submit empty form
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(500);
      
      // Check for validation errors or required attribute
      const nameInput = page.locator('input[name*="name" i]').first();
      
      // Either browser validation or custom error message
      const isInvalid = await nameInput.evaluate((el: any) => !el.checkValidity() || el.hasAttribute('aria-invalid'));
      expect(isInvalid).toBe(true);
    }
  });

  test('should validate email format', async ({ page }) => {
    // Scroll to contact form
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.scrollIntoView();
    });
    
    await page.waitForTimeout(500);
    
    // Fill form with invalid email
    const nameInput = page.locator('input[name*="name" i]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const messageInput = page.locator('textarea').first();
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
      await emailInput.fill('invalid-email');
      await messageInput.fill('Test message');
      
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      await page.waitForTimeout(500);
      
      // Email should show validation error
      const isInvalid = await emailInput.evaluate((el: any) => !el.checkValidity());
      expect(isInvalid).toBe(true);
    }
  });

  test('should accept valid form inputs', async ({ page }) => {
    // Scroll to contact form
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.scrollIntoView();
    });
    
    await page.waitForTimeout(500);
    
    const nameInput = page.locator('input[name*="name" i]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const messageInput = page.locator('textarea').first();
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('John Doe');
      await emailInput.fill('john@example.com');
      await messageInput.fill('This is a test message for the contact form.');
      
      // Inputs should be valid
      const nameValid = await nameInput.evaluate((el: any) => el.checkValidity());
      const emailValid = await emailInput.evaluate((el: any) => el.checkValidity());
      const messageValid = await messageInput.evaluate((el: any) => el.checkValidity() !== false);
      
      expect(nameValid).toBe(true);
      expect(emailValid).toBe(true);
      expect(messageValid).toBe(true);
    }
  });

  test('should submit form with valid data', async ({ page }) => {
    // Scroll to contact form
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.scrollIntoView();
    });
    
    await page.waitForTimeout(500);
    
    // Listen for form submission or success message
    let submissionAttempted = false;
    page.on('framenavigated', () => {
      submissionAttempted = true;
    });
    
    const nameInput = page.locator('input[name*="name" i]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const messageInput = page.locator('textarea').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('Jane Doe');
      await emailInput.fill('jane@example.com');
      await messageInput.fill('I am interested in working with you on a project.');
      await submitButton.click();
      
      // Wait for response
      await page.waitForTimeout(1500);
      
      // Check for success message or confirmation
      // Could be a toast, modal, or success text
      const successIndicators = page.locator(
        'text=/success|sent|thank you|message received/i, [role="alert"]:has-text:/success|sent/'
      );
      
      const hasSuccess = await successIndicators.count() > 0 || submissionAttempted;
      expect(hasSuccess).toBe(true);
    }
  });

  test('should have accessible form with proper labels', async ({ page }) => {
    // Scroll to contact form
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.scrollIntoView();
    });
    
    await page.waitForTimeout(500);
    
    const form = page.locator('form').first();
    
    // Check for labels
    const labels = form.locator('label');
    expect(await labels.count()).toBeGreaterThan(0);
    
    // Verify labels are associated with inputs
    const namesInputs = form.locator('input[name*="name" i]');
    if (await namesInputs.count() > 0) {
      const firstInput = namesInputs.first();
      const inputId = await firstInput.getAttribute('id');
      
      if (inputId) {
        const associatedLabel = form.locator(`label[for="${inputId}"]`);
        await expect(associatedLabel).toBeVisible();
      }
    }
  });

  test('should allow keyboard navigation through form', async ({ page }) => {
    // Scroll to contact form
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.scrollIntoView();
    });
    
    await page.waitForTimeout(500);
    
    // Tab to first input
    const firstInput = page.locator('input').first();
    await firstInput.focus();
    
    // Type in first input
    await page.keyboard.type('Test Name');
    
    // Tab to next input
    await page.keyboard.press('Tab');
    const secondInput = page.locator('input').nth(1);
    
    // Verify focus moved
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('name') || '');
    expect(focusedElement).toBeTruthy();
  });
});
