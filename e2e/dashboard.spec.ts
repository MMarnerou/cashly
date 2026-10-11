import { expect, test } from '@playwright/test'
import { signIn } from './helpers'

test.beforeEach(async ({ page }) => {
  await signIn(page)
})

test('lists the transactions and shows how many are visible', async ({ page }) => {
  await expect(page.locator('button.transaction-row')).toHaveCount(15)
  await expect(page.getByText('Showing 15 of 15')).toBeVisible()
})

test('filtering by status shows only matching transactions', async ({ page }) => {
  await page.getByLabel('Status').selectOption('pending')

  await expect(page.locator('button.transaction-row')).toHaveCount(2)
  await expect(page.getByText('Showing 2 of 15')).toBeVisible()
})

test('searching by merchant narrows the list', async ({ page }) => {
  await page.getByPlaceholder('Search merchants').fill('whole foods')

  await expect(page.locator('button.transaction-row')).toHaveCount(1)
  await expect(page.getByRole('button', { name: /Whole Foods Market/ })).toBeVisible()
})

test('clear filters brings back all transactions', async ({ page }) => {
  await page.getByLabel('Status').selectOption('declined')
  await expect(page.locator('button.transaction-row')).toHaveCount(1)

  await page.getByRole('button', { name: 'Clear filters' }).click()
  await expect(page.locator('button.transaction-row')).toHaveCount(15)
})

test('sorting by amount puts the highest amount first', async ({ page }) => {
  await page.getByLabel('Sort by').selectOption('amount-desc')

  await expect(page.locator('button.transaction-row').first()).toContainText('Acme Corp Payroll')
})

test('clicking a transaction opens its details and the reference can be copied', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.getByRole('button', { name: /Whole Foods Market/ }).click()

  const sidebar = page.locator('dialog.details-sidebar[open]')
  await expect(sidebar.getByRole('heading', { name: 'Whole Foods Market' })).toBeVisible()
  await expect(sidebar.getByText('Transaction reference')).toBeVisible()

  await sidebar.getByRole('button', { name: 'Copy transaction reference' }).click()
  await expect(sidebar.getByText('Copied')).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('txn_001')
})

test('the details panel closes with its close button', async ({ page }) => {
  await page.getByRole('button', { name: /Whole Foods Market/ }).click()
  await page.getByRole('button', { name: 'Close transaction details' }).click()

  await expect(page.locator('dialog.details-sidebar[open]')).toHaveCount(0)
})

test('the profile page shows the signed-in user and the account ID can be copied', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.getByRole('link', { name: 'Profile' }).click()

  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Maria Marnerou')
  await page.getByRole('button', { name: 'Copy account ID' }).click()
  await expect(page.getByRole('button', { name: 'Copy account ID' })).toHaveText('Copied')
})
