import { test, expect } from '@playwright/test'

test.describe('Full Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('landing page loads with expected content', async ({ page }) => {
    await expect(page.locator('text=The Price of a Life')).toBeVisible()
    await expect(page.locator('text=Access Archive')).toBeVisible()
  })

  test('can start the game from landing page', async ({ page }) => {
    await page.click('text=Access Archive')
    await expect(page).toHaveURL(/.*play/)
  })

  test('play page shows case details and input form', async ({ page }) => {
    await page.click('text=Access Archive')
    await expect(page.locator('text=Case')).toBeVisible()
    // Input form should be visible
    await expect(page.locator('input, [data-testid*="guess"], button:has-text("Lock In")')).toBeVisible()
  })

  test('can submit a guess and see reveal', async ({ page }) => {
    await page.click('text=Access Archive')

    // Wait for the play page to load
    await page.waitForURL(/.*play/)

    // Enter a guess value (try to find input field)
    const input = page.locator('input[type="number"], input').first()
    await input.fill('5')

    // Click Lock In or submit
    const lockInButton = page.locator('button:has-text("Lock In"), button:has-text("Submit")').first()
    await lockInButton.click()

    // After submission, should show reveal phase with actual payout
    await expect(page.locator('text=Actual Payout')).toBeVisible()
  })

  test('game flow completes and reaches result page', async ({ page }) => {
    await page.click('text=Access Archive')
    await page.waitForURL(/.*play/)

    // Play through cases (up to 5 rounds or until result)
    for (let i = 0; i < 6; i++) {
      // Check if we're on result page
      if (page.url().includes('/result')) {
        break
      }

      // Check if Empty Chair form is shown
      const emptyChair = page.locator('text=Empty Chair, text=Your Profile, text=Calculate').first()
      if (await emptyChair.isVisible().catch(() => false)) {
        // Fill Empty Chair form if present
        const ageInput = page.locator('input[type="number"]').first()
        if (await ageInput.isVisible().catch(() => false)) {
          await ageInput.fill('30')
          const submit = page.locator('button:has-text("Submit"), button:has-text("Calculate")').first()
          await submit.click()
        }
        break
      }

      // Try to submit a guess
      const input = page.locator('input[type="number"], input').first()
      if (await input.isVisible().catch(() => false)) {
        await input.fill('5')
        const lockIn = page.locator('button:has-text("Lock In"), button:has-text("Submit")').first()
        if (await lockIn.isVisible().catch(() => false)) {
          await lockIn.click()
          // Wait for reveal
          await page.waitForTimeout(500)
          // Click continue/next
          const next = page.locator('button:has-text("Next"), button:has-text("Continue")').first()
          if (await next.isVisible().catch(() => false)) {
            await next.click()
          }
        }
      }
    }

    // Should eventually reach result page or show bias analysis
    await expect(
      page.locator('text=bias, text=report, text=Your Results').first()
    ).toBeVisible()
  })
})
