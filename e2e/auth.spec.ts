import { expect, test } from '@playwright/test'
import { signIn } from './helpers'

test('signing in shows the dashboard', async ({ page }) => {
  await signIn(page)

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('search', { name: 'Filter transactions' })).toBeVisible()
})

test('signing out returns to the sign-in page', async ({ page }) => {
  await signIn(page)

  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/login$/)
})
