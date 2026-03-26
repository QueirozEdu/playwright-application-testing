import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});

test.describe('Validade homepage', () => {
  test('Sidebar buttons are clickable', async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
    await page.getByText('Datepicker').click();
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Extra Components').click();
    await page.getByText('Tables & Data').click();
    await page.getByText('Auth').click();
  });
});
