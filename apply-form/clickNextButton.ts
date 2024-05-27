import { Page } from 'puppeteer';
import selectors from '../selectors';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function clickNextOrSubmitButton(page: Page): Promise<void> {
  const maxRetries = 15;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    console.log(`Attempt ${attempt} of 15 to click Next/Submit before skipping`);

    // Wait for the Easy Apply modal to appear
    await page.waitForSelector(selectors.easyApplyButtonEnabled, { timeout: 10000 });
    //console.log('Easy Apply modal is present');

    const submitButton = await page.$(selectors.submit);
    const nextButton = await page.$(selectors.nextButton);

    if (submitButton) {
      const isSubmitButtonVisible = await submitButton.evaluate(el => (el as HTMLElement).offsetParent !== null);
      console.log(`Submit button exists and is visible: ${isSubmitButtonVisible}`);
      if (isSubmitButtonVisible) {
        await submitButton.click();
        console.log('Submit button clicked');
        // Check for errors after clicking submit
        if (await checkAndReportErrors(page)) return;
        await handleCloseWindowOrModal(page);
        return;
      }
    }

    if (nextButton) {
      const isNextButtonVisible = await nextButton.evaluate(el => (el as HTMLElement).offsetParent !== null);
      //console.log(`Next button exists and is visible: ${isNextButtonVisible}`);
      if (isNextButtonVisible) {
        await nextButton.click();
        console.log('Next button clicked');
        await delay(2000);
        // Check for errors after clicking next
        if (await checkAndReportErrors(page)) return;
        continue;
      }
    }

    //console.error(`No actionable button found (Next/Submit) in attempt ${attempt}`);
    if (attempt >= maxRetries) {
      throw new Error('Next or Submit button not found or not clickable');
    }
    console.log('Retrying...');
    await delay(1000);
  }
}

// Error checking function
async function checkAndReportErrors(page: Page): Promise<boolean> {
  const errorMessages = await page.$$eval('.artdeco-inline-feedback__message', nodes => 
  nodes.map(n => n.textContent ? n.textContent.trim() : "")
);

  if (errorMessages.some(msg => msg.includes('Please enter a number'))) {
    console.error('Error detected: ', errorMessages.join(', '));
    return true; // Return true indicating an error was found
  }
  return false;
}

async function handleCloseWindowOrModal(page: Page): Promise<void> {
  try {
    // First, check if the close button is present and click it
    if (await page.waitForSelector(selectors.modalCloseButton, { timeout: 5000 })) {
      await page.click(selectors.modalCloseButton);
      console.log('Modal close button clicked, waiting for confirmation dialog...');

      // Ensure that there's enough time for any dialogs to appear after the close action
      await page.waitForTimeout(1000);

      // Now check for the confirmation dialog and handle it
      if (await page.waitForSelector(selectors.discardApplicationConfirmButton, { timeout: 5000 })) {
        await page.click(selectors.discardApplicationConfirmButton);
        console.log('Confirmation dialog handled, application discarded.');
      } else {
        console.log('Confirmation dialog did not appear or was not needed.');
      }
    } else {
      console.log('Modal close button not found or was not needed.');
    }
  } catch (error) {
    console.error('Failed to close modal or handle confirmation:', error);
  }
}



export default clickNextOrSubmitButton;
