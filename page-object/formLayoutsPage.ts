import { Page } from '@playwright/test';

export class FormLayoutsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
    const usingTheGridForm = this.page.locator('nb-card', {
      hasText: 'Using the Grid',
    });
    await usingTheGridForm.getByRole('textbox', { name: 'Email' }).clear();
    await usingTheGridForm.getByRole('textbox', { name: 'Email' }).fill(email);

    await usingTheGridForm.getByRole('textbox', { name: 'Password' }).clear();
    await usingTheGridForm.getByRole('textbox', { name: 'Password' }).fill(password);

    await usingTheGridForm.getByRole('radio', { name: optionText }).check({ force: true });

    await usingTheGridForm.getByRole('button').click();
  }

  /**
   * Fills out the inline form
   * @param name - First and last name
   * @param email - Registred email
   * @param rememberMe - Remember login credentials
   */
  async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
    const inlineForm = this.page.locator('nb-card', {
      hasText: 'Inline form',
    });

    await inlineForm.getByRole('textbox', { name: 'Jane Doe' }).clear();
    await inlineForm.getByRole('textbox', { name: 'Jane Doe' }).fill(name);

    await inlineForm.getByRole('textbox', { name: 'Email' }).clear();
    await inlineForm.getByRole('textbox', { name: 'Email' }).fill(email);

    if (rememberMe) {
      await inlineForm.getByRole('checkbox').check({ force: true });
    }
    await inlineForm.getByRole('button').click();
  }
}
