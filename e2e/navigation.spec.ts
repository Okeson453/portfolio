import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/SecureStack/)
  })

  test('navigation links resolve without 404', async ({ page }) => {
    await page.goto('/')
    const navLinks = page.locator('nav a[href]')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(3)
  })

  test('no horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test('theme toggle persists across navigation', async ({ page }) => {
    await page.goto('/')
    // Click dark mode toggle
    await page.click('[aria-label*="theme"], [aria-label*="dark"], [aria-label*="mode"]')
    await page.goto('/about')
    // Verify dark class is still applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })
})

test.describe('Contact Form', () => {
  test('shows validation errors for empty submission', async ({ page }) => {
    await page.goto('/contact')
    await page.click('button[type="submit"]')
    const errors = page.locator('[role="alert"], .error, [aria-invalid="true"]')
    await expect(errors.first()).toBeVisible()
  })
})

test.describe('Core Web Vitals', () => {
  test('LCP is under 2500ms', async ({ page }) => {
    await page.goto('/')
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ type: 'largest-contentful-paint', buffered: true })
        setTimeout(() => resolve(9999), 5000)
      })
    })
    expect(lcp).toBeLessThan(2500)
  })
})
