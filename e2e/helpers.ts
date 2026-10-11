import { expect, type Page } from '@playwright/test'
import { demoUser } from '../mocks/mockUsers'

// Signs in with the demo account and waits for the dashboard to load.
export const signIn = async (page: Page) => {
  await page.goto('/login')
  await page.fill('input[name=email]', demoUser.email)
  await page.fill('input[name=password]', demoUser.password)
  await page.click('button[type=submit]')
  await page.waitForURL('/')
  await expect(page.locator('.account-summary')).toBeVisible()
}
