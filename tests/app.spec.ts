// ./tests/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('Home page should render successfully', async ({ page }) => {
  await page.goto('http://localhost:4100/home/');

  await expect(page).toHaveTitle(/《现代前端工程体验优化》示例项目/);

  await expect(
    await page.getByRole('link', { name: '《现代前端工程体验优化》demo' }),
  ).toBeVisible();
  const signUpPageLinkBtn = await page.getByRole('link', { name: 'Sign Up' });
  await expect(signUpPageLinkBtn).toBeVisible();
  await signUpPageLinkBtn.click();

  await page.waitForTimeout(500);
  await expect(
    await page.getByRole('button', { name: 'Sign Up' }),
  ).toBeVisible();
});
