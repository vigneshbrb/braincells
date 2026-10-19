import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

async function openBrowse(page: import('@playwright/test').Page) {
  await page.goto('/signin')
  await page.getByRole('textbox', { name: 'Email' }).fill('reader@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByRole('button', { name: 'You', exact: true }).click()
  await expect(page.getByTestId('hero')).toBeVisible()
}

for (const width of [360, 768, 1280]) {
  test(`browse layout fits ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await openBrowse(page)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

    const row = page.getByTestId('row').filter({ has: page.getByRole('heading', { name: 'Focus' }) })
    const scroller = row.getByTestId('row-scroller')
    await expect(scroller.getByTestId('poster-card').first()).toBeVisible()
    if (width === 360) {
      const sizes = await scroller.evaluate((element) => {
        const first = element.querySelector('[data-testid="poster-card"]')!.getBoundingClientRect()
        return { visible: element.clientWidth, card: first.width }
      })
      expect(sizes.visible / sizes.card).toBeGreaterThan(2.2)
      expect(sizes.visible / sizes.card).toBeLessThan(2.5)
      await page.getByRole('button', { name: 'Open navigation' }).click()
      await expect(page.getByRole('link', { name: 'My List' })).toBeVisible()
    }

    await page.getByTestId('hero').getByRole('button', { name: 'More Info', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  })
}

test('browse supports keyboard focus and has no axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openBrowse(page)
  const row = page.getByTestId('row').filter({ has: page.getByRole('heading', { name: 'Focus' }) })
  const openers = row.getByRole('button', { name: /More info about/ })
  await openers.first().focus()
  await page.keyboard.press('ArrowRight')
  await expect(openers.nth(1)).toBeFocused()
  expect(await openers.nth(1).evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none')

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])

  await page.getByTestId('hero').getByRole('button', { name: 'More Info', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCSS('opacity', '1')
  const dialogResults = await new AxeBuilder({ page }).analyze()
  expect(dialogResults.violations).toEqual([])
})

test('sign in and profile selection have no axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/signin')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.getByRole('textbox', { name: 'Email' }).fill('reader@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})
