import { DatepickerPage } from '../page-object/datePickerPage';
import { FormLayoutsPage } from '../page-object/formLayoutsPage';
import { NavigationPage } from './../page-object/NavigationPage';
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});

test('navigate to form page', async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.formLayoutPage();
  await navigateTo.datePickerPage();
  await navigateTo.smartTablePage();
  await navigateTo.toastrPage();
  await navigateTo.toastrPage();
});

test('parametrized methods', async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  const onFormLayoutPage = new FormLayoutsPage(page);
  const onDatepickerPage = new DatepickerPage(page);

  await navigateTo.formLayoutPage();
  await onFormLayoutPage.submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'testtest', 'Option 1');
  await onFormLayoutPage.submitInlineFormWithNameEmailAndCheckbox('John Smith', 'john@test.com', false);
  await navigateTo.datePickerPage();
  await onDatepickerPage.selectCommonDatepickerDateFromToday(30);
  await onDatepickerPage.selectDateWhitinRageStartingToday(6, 14);
});
