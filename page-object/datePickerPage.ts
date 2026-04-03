import { Page, expect } from '@playwright/test';

export class DatepickerPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectCommonDatepickerDateFromToday(numberOfDaysFromToday: number) {
    const commonDatepicker = this.page.getByPlaceholder('Form Picker');
    await commonDatepicker.click();
    const dateToAssert = await this.selectDateInCalendar(numberOfDaysFromToday, 'Common Datepicker');

    await expect(commonDatepicker).toHaveValue(dateToAssert);
  }
  async selectDateWhitinRageStartingToday(startDayFromToday: number, endDayFromToday: number) {
    const calendarInput = this.page.getByPlaceholder('Range Picker');
    await calendarInput.click();
    const dateToAssertStart = await this.selectDateInCalendar(startDayFromToday, 'Datepicker With Range');
    const dateToAssertEnd = await this.selectDateInCalendar(endDayFromToday, 'Datepicker With Range');
    const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`;
    await expect(calendarInput).toHaveValue(dateToAssert);
  }

  private async selectDateInCalendar(numberOfDaysFromToday: number, calendarTitle: string) {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);

    //Creates the string in the correct format
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('EN-US', { month: 'short' });
    const expectMonthLong = date.toLocaleString('EN-US', { month: 'long' });
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    //Handles dates that are not in the current month
    let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthLong = date.toLocaleString('EN-US', { month: 'long' });
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`;
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
      await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
      calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
    }

    let calendarLocator;
    switch (calendarTitle) {
      case 'Datepicker With Range':
        calendarLocator = '[class="range-cell day-cell ng-star-inserted"]';
        break;
      case 'Common Datepicker':
        calendarLocator = '[class="day-cell ng-star-inserted"]';
    }
    await this.page.locator(calendarLocator).getByText(expectedDate, { exact: true }).click();
    return dateToAssert;
  }
}
