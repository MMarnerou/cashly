import { expect, test } from '@playwright/test'
import { signIn } from './helpers'

test.beforeEach(async ({ page }) => {
  await signIn(page)
})

test('the phone bottom bar is visible and the text header links are hidden', async ({ page }) => {
  await expect(page.locator('.bottom-nav')).toBeVisible()
  await expect(page.locator('.site-header__nav')).toBeHidden()
})

test('the bottom bar icons go to the transactions and profile pages', async ({ page }) => {
  await page.locator('.bottom-nav a[aria-label="Profile"]').click()
  await expect(page).toHaveURL(/\/profile$/)

  await page.locator('.bottom-nav a[aria-label="Transactions"]').click()
  await expect(page).toHaveURL('/')
})

test('the bottom bar sign out button signs out', async ({ page }) => {
  await page.locator('.bottom-nav button[aria-label="Sign out"]').click()

  await expect(page).toHaveURL(/\/login$/)
})

test('the page has no horizontal scrolling and transactions open on a phone', async ({ page }) => {
  const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflows).toBe(false)

  await page.locator('button.transaction-row').first().click()
  await expect(page.locator('dialog.details-sidebar[open]')).toBeVisible()
})
