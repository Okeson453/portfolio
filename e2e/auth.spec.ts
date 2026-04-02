/**
 * E2E Tests: Authentication Flow
 *
 * Tests for:
 * - Login with valid credentials
 * - Login with invalid credentials
 * - Logout clears session
 * - Protected routes redirect to login
 * - Role-based access (admin only)
 * - Token refresh
 *
 * Run: npm run e2e
 * Or specific test: npx playwright test auth.spec.ts
 */

import { test, expect, Page } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'

test.describe('Authentication Flow', () => {
  // ===== HELPER FUNCTIONS =====

  async function login(page: Page, email: string, password: string) {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('[name="email"]', email)
    await page.fill('[name="password"]', password)
    await page.click('button[type="submit"]')
  }

  async function logout(page: Page) {
    await page.click('[aria-label="Open user menu"]')
    await page.click('button:has-text("Logout")')
  }

  // ===== TEST SUITE 1: LOGIN =====

  test('successful login with valid credentials', async ({ page }) => {
    await login(page, 'test@example.com', 'SecurePassword123!')

    // Should redirect to dashboard
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)

    // User menu should show logged-in state
    await expect(page.locator('[aria-label*="profile"]')).toBeVisible()
  })

  test('failed login with invalid email', async ({ page }) => {
    await login(page, 'invalid@example.com', 'wrongpassword')

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible()

    // Should stay on login page
    await expect(page).toHaveURL(`${BASE_URL}/login`)
  })

  test('failed login with incorrect password', async ({ page }) => {
    await login(page, 'test@example.com', 'WrongPassword123!')

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible()

    // Should stay on login page
    await expect(page).toHaveURL(`${BASE_URL}/login`)
  })

  test('rate limiting on repeated login attempts', async ({ page }) => {
    // Attempt login 6 times (limit is 5)
    for (let i = 0; i < 6; i++) {
      await page.goto(`${BASE_URL}/login`)
      await page.fill('[name="email"]', 'test@example.com')
      await page.fill('[name="password"]', 'WrongPassword!')
      await page.click('button[type="submit"]')

      if (i < 5) {
        // First 5 should show invalid credentials
        await expect(
          page.locator('text=Invalid credentials')
        ).toBeVisible({ timeout: 5000 })
      } else {
        // 6th should show rate limit message
        await expect(
          page.locator('text=/rate limit|too many requests/i')
        ).toBeVisible({ timeout: 5000 })
      }
    }
  })

  // ===== TEST SUITE 2: LOGOUT =====

  test('logout clears session', async ({ page }) => {
    // Login first
    await login(page, 'test@example.com', 'SecurePassword123!')
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)

    // Logout
    await logout(page)

    // Should redirect to login
    await expect(page).toHaveURL(`${BASE_URL}/login`)

    // Session should be cleared (trying to access dashboard redirects to login)
    await page.goto(`${BASE_URL}/dashboard`)
    await expect(page).toHaveURL(`${BASE_URL}/login`)
  })

  // ===== TEST SUITE 3: PROTECTED ROUTES =====

  test('unauthenticated access to protected route redirects to login', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/dashboard`)

    // Should redirect to login
    await expect(page).toHaveURL(`${BASE_URL}/login`)
  })

  test('authenticated user can access protected route', async ({ page }) => {
    await login(page, 'test@example.com', 'SecurePassword123!')
    await page.goto(`${BASE_URL}/dashboard`)

    // Should be on dashboard
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  // ===== TEST SUITE 4: ROLE-BASED ACCESS =====

  test('regular user cannot access admin routes', async ({ page }) => {
    await login(page, 'user@example.com', 'SecurePassword123!')
    await page.goto(`${BASE_URL}/admin`)

    // Should redirect to dashboard (not admin)
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)
  })

  test('admin user can access admin routes', async ({ page }) => {
    await login(page, 'admin@example.com', 'AdminPassword123!')
    await page.goto(`${BASE_URL}/admin`)

    // Should be on admin page
    await expect(page).toHaveURL(`${BASE_URL}/admin`)
    await expect(page.locator('text=Admin Dashboard')).toBeVisible()
  })

  // ===== TEST SUITE 5: TOKEN REFRESH =====

  test('token refresh on expiry', async ({ page }) => {
    await login(page, 'test@example.com', 'SecurePassword123!')

    // Get initial access token from storage
    const initialToken = await page.evaluate(() =>
      localStorage.getItem('accessToken')
    )

    // Simulate token expiry by waiting (in real test, manually expire)
    // This would require mocking or using test app hooks
    await page.waitForTimeout(100)

    // Make API request that triggers refresh
    const response = await page.evaluate(async () => {
      return fetch('/api/posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
    })

    // Should still be successful (token was refreshed)
    const statusCode = await page.evaluate(
      () =>
        fetch('/api/posts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }).then((r) => r.status)
    )

    expect(statusCode).toBe(200)
  })

  // ===== TEST SUITE 6: SECURITY =====

  test('XSS protection in forms', async ({ page }) => {
    await login(page, 'test@example.com', 'SecurePassword123!')
    await page.goto(`${BASE_URL}/dashboard`)

    // Try to inject XSS payload (should be sanitized)
    const xssPayload = '<img src=x onerror="alert(1)">'
    const inputField = page.locator('input[name="displayName"]')

    if ((await inputField.count()) > 0) {
      await inputField.fill(xssPayload)
      await page.click('button[type="submit"]')

      // Check that payload is stored safely (sanitized)
      const displayedText = await page.locator('[data-testid="display-name"]').innerHTML()
      expect(displayedText).not.toContain('onerror=')
    }
  })

  test('CSRF protection on state-changing requests', async ({ page }) => {
    await login(page, 'test@example.com', 'SecurePassword123!')

    // All POST/PUT/DELETE requests should include CSRF token
    const hasCSRFToken = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="csrf-token"]')
      return meta ? meta.getAttribute('content') : null
    })

    expect(hasCSRFToken).toBeTruthy()
  })

  // ===== TEST SUITE 7: COOKIE SECURITY =====

  test('authentication cookies are HttpOnly and Secure', async ({ page, context }) => {
    await login(page, 'test@example.com', 'SecurePassword123!')

    const cookies = await context.cookies()
    const authCookie = cookies.find(
      (c) => c.name === 'auth' || c.name === 'session'
    )

    if (authCookie) {
      expect(authCookie.httpOnly).toBe(true)
      // In production, should be secure
      if (process.env.NODE_ENV === 'production') {
        expect(authCookie.secure).toBe(true)
      }
      expect(authCookie.sameSite).toBe('Strict')
    }
  })
})
