import { test, expect } from '@playwright/test';
import { assert } from 'console';
import { delay } from 'rxjs-compat/operator/delay';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});

test.describe('Form layouts page', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  test('Input fields', async ({ page }) => {
    const usingTheGridEmailInput = page.locator('#inputEmail1');

    await usingTheGridEmailInput.fill('test@test.com');
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially('test1234@test.com', {
      delay: 10,
    });

    //Generic assertions
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual('test1234@test.com');

    //locator assertion
    await expect(usingTheGridEmailInput).toHaveValue('test1234@test.com');
  });
  // ############################################################
  // RADIO BUTTONS

  test('Radio buttons', async ({ page }) => {
    const usingTheGridFormFirstRadioButton = page
      .locator('.outer-circle')
      .first();
    await usingTheGridFormFirstRadioButton.check({ force: true });

    const radioStatus = await usingTheGridFormFirstRadioButton.isChecked();
    expect(radioStatus).toBeTruthy();

    await expect(usingTheGridFormFirstRadioButton).toBeChecked();

    //Validate that after clicking the option 2, option 1 will not be checked
    const usingTheGridFormSecondRadioButton = page.locator(
      'nb-radio:nth-child(2) > label > .inner-circle',
    );

    await usingTheGridFormSecondRadioButton.click();
    const radioTwoStatus = await usingTheGridFormSecondRadioButton.isChecked();
    expect(radioTwoStatus).toBeTruthy();
    await expect(usingTheGridFormFirstRadioButton).not.toBeChecked();
  });
});

test('checkboxes', async ({ page }) => {
  await page.getByRole('link', { name: 'Modal & Overlays' }).click();
  await page.getByRole('link', { name: 'Toastr' }).click();

  //check checkbox
  await page.locator('.custom-checkbox').first().check();

  //uncheck checkbox
  await page.getByText('Show toast with icon').uncheck();

  //check all checkboxes
  const allCheckboxes = await page.locator('.custom-checkbox');

  for (const box of await allCheckboxes.all()) {
    await box.check();
    expect(box.isChecked).toBeTruthy();
  }
});

test('Open the themes dropdown', async ({ page }) => {
  const themeButton = page.getByRole('button').first();
  await themeButton.click();

  const optionList = page.locator('nb-option-list nb-option');
  await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);

  const darkThemeButton = page.getByText('Dark');
  await darkThemeButton.click();

  const header = page.locator('nb-layout-header');

  await expect(header).toHaveCSS('background-color', 'rgb(34, 43, 69)');

  //Loop through all the themes and colors
});

test('tooltip testing', async ({ page }) => {
  await page.getByText('Modal & Overlays').click();
  await page.getByText('Tooltip').click();

  const placementsCard = page.locator('nb-card', {
    hasText: 'Tooltip Placements',
  });
  const topButton = placementsCard.getByRole('button', { name: 'Top' });
  await topButton.hover();

  const tooltipText = page.locator('nb-tooltip').textContent();
  expect(await tooltipText).toBe('This is a tooltip');
});
