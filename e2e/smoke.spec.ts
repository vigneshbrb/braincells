import { expect, test } from '@playwright/test'

test('sign in, select a profile, add a title, and open its player', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/signin$/)
  await page.getByRole('textbox', { name: 'Email' }).fill('reader@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByRole('heading', { name: "Who's watching?" })).toBeVisible()
  await page.getByRole('button', { name: 'You', exact: true }).click()
  await expect(page.getByTestId('hero')).toBeVisible()

  await page.getByTestId('hero').getByRole('button', { name: 'More Info', exact: true }).click()
  const dialog = page.getByRole('dialog')
  const title = await dialog.getByRole('heading', { level: 2 }).textContent()
  await dialog.getByRole('button', { name: '+ My List' }).click()
  await expect(dialog.getByRole('button', { name: '✓ In My List' })).toBeVisible()
  await dialog.getByRole('button', { name: '▶ Play' }).click()

  await expect(page.getByTestId('player-view')).toBeVisible()
  await expect(page.getByTestId('player-view').getByRole('heading', { name: title! })).toBeVisible()
  await expect(page.getByTestId('player-video')).toHaveAttribute('src', /\.mp4$/)
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible()
})
