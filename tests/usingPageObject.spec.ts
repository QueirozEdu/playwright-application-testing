import { test } from '@playwright/test';
import { PageManager } from '../page-object/pageManager';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});

test('navigate to form page', async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutPage();
  await pm.navigateTo().datePickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().toastrPage();
});

test('parametrized methods', async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formLayoutPage();
  await pm
    .onFormLayoutPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'testtest', 'Option 1');
  await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox('John Smith', 'john@test.com', false);
  await pm.navigateTo().datePickerPage();
  await pm.onDatepickerPage().selectCommonDatepickerDateFromToday(30);
  await pm.onDatepickerPage().selectDateWhitinRageStartingToday(6, 14);
});
