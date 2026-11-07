import { expect, test } from '@playwright/test'

test('sign-in redirects to /app', async ({ page }) => {
  await page.goto('/sign-in')
  await expect(
    page.getByRole('heading', { name: /entrar na sua conta/i }),
  ).toBeVisible()

  await page.getByLabel('E-mail').fill('test@test.com')
  await page.getByLabel('Senha', { exact: true }).fill('123456')
  await page.getByRole('button', { name: /entrar/i }).click()

  await page.waitForURL('**/app')
  expect(page.url()).toContain('/app')
})
