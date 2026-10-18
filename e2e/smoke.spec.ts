import { expect, test } from '@playwright/test'

test('app opens at sign in', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/signin$/)
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
})
