import test, { expect } from '@playwright/test';

test('Drag and drop with iFrame', async ({ page }) => {
  await page.goto('https://www.globalsqa.com/demo-site/draganddrop/');

  //iFrame locator
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

  await frame
    .locator('li', { hasText: 'High Tatras 2' })
    .dragTo(frame.locator('#trash'));
});
