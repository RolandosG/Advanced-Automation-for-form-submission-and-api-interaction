import puppeteer, { Page, ElementHandle } from 'puppeteer';
import selectors from '../selectors';
import fillFields from '../apply-form/fillFields';
import { checkForFormErrors, handleFormError } from '../apply-form/formErrorHandling';
import clickNextOrSubmitButton from '../apply-form/clickNextButton';
import dismissModal from '../apply-form/dismissButton';

export interface ApplicationFormData {
  phone: string;
  cvPath: string;
  homeCity: string;
  coverLetterPath: string;
  yearsOfExperience: { [key: string]: number };
  languageProficiency: { [key: string]: string | string[] };
  requiresVisaSponsorship: boolean;
  booleans: { [key: string]: boolean };
  textFields: { [key: string]: string };
  multipleChoiceFields: { [key: string]: string };
  workAuthorized: string;
  criminalHistory: string;
  salaryExpectation: string;
  noticePeriod: string;
  preferredLanguage: string;
  basedProvince: string;
}

export interface Params {
  page: Page;
  link: string;
  formData: ApplicationFormData;
  shouldSubmit: boolean;
}

async function apply({ page, link, formData, shouldSubmit }: Params): Promise<void> {
  try {
    console.log(`Processing job link: ${link}`);
    const easyApplyButton = await page.waitForSelector(selectors.easyApplyButtonEnabled, { timeout: 20000 });
    if (easyApplyButton) {
      await easyApplyButton.click();
      console.log('Easy Apply button clicked.');
    } else {
      console.log('Easy apply button not found.');
      return;
    }

    let maxPages = 5;
    while (maxPages--) {
      await fillFields(page, formData);

      const formError = await checkForFormErrors(page);
      if (formError) {
        console.log(`Form error detected: ${formError}`);
        const resolution = await handleFormError(page, formError);
        if (!resolution.success) {
          console.log('Failed to resolve form error, stopping application process.');
          return;
        }
      }

      await clickNextOrSubmitButton(page);
      if (shouldSubmit) {
        await dismissModal(page);
      }
    }
  } catch (error) {
    console.error('Error applying to job:', error);
  }
}


export default apply;
