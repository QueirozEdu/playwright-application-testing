import { test, expect } from '@playwright/test';

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
  expect(await tooltipText).toEqual('This is a tooltip');
});

test('Alert and dialog', async ({ page }) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  //Clicks the Delete Icon for mdo@gmail.com user
  page.on('dialog', (dialog) => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?');
    dialog.accept();
  });

  await page
    .getByRole('table')
    .locator('tr', { hasText: 'mdo@gmail.com' })
    .locator('.nb-trash')
    .click();

  expect(page.locator('table')).not.toHaveText('mdo@gmail.com');
});

//When editing a row, the field type is changed and this tests consists in dealing with that to update the age
test('Change the age', async ({ page }) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  const targetRow = page.getByRole('row', { name: 'twitter@outlook.com' });
  await targetRow.locator('.nb-edit').click();

  await targetRow.getByPlaceholder('Age').clear();
  await targetRow.getByPlaceholder('Age').fill('25');
  await targetRow.locator('.nb-checkmark').click();

  expect(
    await targetRow.locator('.ng-star-inserted').nth(20).textContent(),
  ).toEqual('25');
});

//Edit row by selecting user ID
test('Edit row by user id', async ({ page }) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  await page.locator('ng2-smart-table-pager').getByText('2').click();

  const targetRowById = page
    .getByRole('row', { name: '11' })
    .filter({ has: page.locator('td').nth(1).getByText('11') });

  await targetRowById.locator('.nb-edit').click();

  await page.locator('input-editor').getByPlaceholder('E-mail').clear;
  await page
    .locator('input-editor')
    .getByPlaceholder('E-mail')
    .fill('new@email.com');

  await page.locator('.nb-checkmark').click();
  expect(await targetRowById.locator('td').nth(5)).toHaveText('new@email.com');
});

//loop through ages and verify they exist or not
test('Loop through ages', async ({ page }) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  const ages = ['20', '30', '40', '200'];

  for (let age of ages) {
    await page.locator('input-filter').getByPlaceholder('Age').clear();
    await page.locator('input-filter').getByPlaceholder('Age').fill(age);
    await page.waitForTimeout(400);
    const ageRows = page.locator('tbody tr');

    for (let row of await ageRows.all()) {
      const cellValue = await row.locator('td').last().textContent();

      if (age == '200') {
        expect(await page.getByRole('table').textContent()).toContain(
          'No data found',
        );
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
});

test('Datepicker', async ({ page }) => {
  await page.getByText('Forms').click();
  await page.getByText('Datepicker').click();

  const commonDatepicker = page.getByPlaceholder('Form Picker');
  const daysInTheFuture = 50;

  await commonDatepicker.click();

  let date = new Date();
  date.setDate(date.getDate() + daysInTheFuture);

  //Creates the string in the correct format
  const expectedDate = date.getDate().toString();
  const expectedMonth = date.toLocaleString('EN-US', { month: 'short' });
  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonth} ${expectedDate}, ${expectedYear}`;

  //Handles dates that are not in the current month
  let calendarMonthAndYear = await page
    .locator('nb-calendar-view-mode')
    .textContent();
  const expectedMonthLong = date.toLocaleString('EN-US', { month: 'long' });
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`;
  while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
    await page
      .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
      .click();
    calendarMonthAndYear = await page
      .locator('nb-calendar-view-mode')
      .textContent();
  }

  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText(expectedDate, { exact: true })
    .click();

  await expect(commonDatepicker).toHaveValue(dateToAssert);
});

test('Sliders', async ({ page }) => {
  //Update attribute
  const tempGauge = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger circle',
  );
  await tempGauge.evaluate((node) => {
    node.setAttribute('cx', '232.530');
    node.setAttribute('cy', '232.530');
  });
  await tempGauge.click();
});
