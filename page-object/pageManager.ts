import { Page } from '@playwright/test';
import { DatepickerPage } from '../page-object/datePickerPage';
import { FormLayoutsPage } from '../page-object/formLayoutsPage';
import { NavigationPage } from './../page-object/NavigationPage';

export class PageManager {
  private readonly page: Page;
  private readonly navigationPage: NavigationPage;
  private readonly formsLayoutsPage: FormLayoutsPage;
  private readonly datepickerPage: DatepickerPage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.formsLayoutsPage = new FormLayoutsPage(this.page);
    this.datepickerPage = new DatepickerPage(this.page);
  }

  navigateTo() {
    return this.navigationPage;
  }
  onFormLayoutPage() {
    return this.formsLayoutsPage;
  }
  onDatepickerPage() {
    return this.datepickerPage;
  }
}
