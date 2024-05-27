import { Page } from 'puppeteer';
import selectors from '../selectors';

interface MultipleChoiceFields {
  [labelRegex: string]: string | string[];
}

async function fillMultipleChoiceFields(page: Page, multipleChoiceFields: MultipleChoiceFields): Promise<boolean> {
  const selects = await page.$$(selectors.select);
  let allFilledSuccessfully = true;

  for (const select of selects) {
    const id = await select.evaluate(el => el.id);
    const label = await page.evaluate((id) => {
      const labelElement = document.querySelector(`label[for="${id}"]`);
      return labelElement ? labelElement.textContent?.trim() : null;
    }, id);
    
    if (label) {
      let fieldFilled = false;
      for (const [labelRegex, valueOptions] of Object.entries(multipleChoiceFields)) {
        const values = Array.isArray(valueOptions) ? valueOptions.map(value => value.toLowerCase()) : [valueOptions.toLowerCase()];
        if (new RegExp(labelRegex, 'i').test(label)) {
          const optionValue = await select.$$eval(selectors.option, (options, values) => {
            const matchingOption = options.find(option => {
              const optionText = option.textContent?.trim().toLowerCase();
              return optionText ? values.includes(optionText) : false;
            });
            return matchingOption ? (matchingOption as HTMLOptionElement).value : null;
          }, values);

          if (optionValue) {
            await select.select(optionValue);
            console.log(`Selected '${optionValue}' for '${label}'`);
            fieldFilled = true;
            break;
          }
        }
      }
      if (!fieldFilled) {
        console.error(`No matching option found for '${label}'`);
        allFilledSuccessfully = false;
      }
    } else {
      console.log(`Label for select element not found or is empty.`);
      allFilledSuccessfully = false;
    }
  }
  return allFilledSuccessfully;
}

export default fillMultipleChoiceFields;
