import { Page, ElementHandle } from 'puppeteer';
import selectors from '../selectors';

interface TextFields {
  [labelRegex: string]: string | number;
}

async function fillTextFields(page: Page, textFields: TextFields): Promise<void> {
  const inputs = await page.$$(selectors.textInput);
  const selects = await page.$$(selectors.select); // Selector for select elements

  // Handle text and numeric inputs
  for (const input of inputs) {
    const label = await getLabelForInput(page, input);
    if (!label) continue;

    let handled = false;
    for (const [labelRegex, value] of Object.entries(textFields)) {
      if (new RegExp(labelRegex, 'i').test(label)) {
        await clearAndType(page, input, value.toString());
        console.log(`Filled '${label}' with '${value}'`);
        handled = true;
        break;
      }
    }
    // Handle specific numeric questions such as years of experience
    if (/years of experience/i.test(label) && !handled) {
      await clearAndType(page, input, "1"); // Default to 1 year if not specified
      console.log(`Filled '${label}' with '1' for experience question`);
    }
  }

  // Handle select dropdowns
  for (const select of selects) {
    const label = await getLabelForInput(page, select);
    if (!label) continue;

    for (const [labelRegex, value] of Object.entries(textFields)) {
      if (new RegExp(labelRegex, 'i').test(label)) {
        await selectDropdownOption(page, select, value.toString());
        console.log(`Selected '${value}' for '${label}'`);
        break;
      }
    }
  }
}

async function getLabelForInput(page: Page, element: ElementHandle): Promise<string | null> {
  const id = await element.evaluate(el => el.id);
  return page.evaluate((id) => {
    const labelElement = document.querySelector(`label[for="${id}"]`);
    return labelElement?.textContent?.trim() ?? null;
  }, id);
}

async function clearAndType(page: Page, input: ElementHandle, newText: string): Promise<void> {
  await input.click();
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await input.type(newText);
}

async function selectDropdownOption(page: Page, select: ElementHandle, value: string): Promise<void> {
  await select.select(value); // This assumes that value corresponds to the option value
}

export default fillTextFields;
