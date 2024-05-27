import { ElementHandle, Page } from 'puppeteer';

import selectors from '../selectors';

async function fillBoolean(page: Page, booleans: { [key: string]: boolean }): Promise<void> {
  const fieldsets = await page.$$(selectors.fieldset);

  for (const fieldset of fieldsets) {
    const legend = await fieldset.$eval('legend', el => el.textContent?.trim());
    if (!legend) continue; // Skip if no legend text is found

    for (const [labelRegex, value] of Object.entries(booleans)) {
      if (new RegExp(labelRegex, "i").test(legend)) {
        const options = await fieldset.$$('input[type="radio"]');
        if (options.length === 2) {  // Assuming there are always 2 options: Yes and No
          const choiceIndex = value ? 0 : 1;  // 'Yes' is the first button, 'No' is the second
          await options[choiceIndex].click();  // Click the appropriate option based on true (Yes) or false (No)
          console.log(`Set '${legend}' to '${value ? "Yes" : "No"}'`);
          break;
        }
      }
    }
  }
}

export default fillBoolean;
