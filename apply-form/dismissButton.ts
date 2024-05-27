import { Page } from 'puppeteer';
import selectors from '../selectors';

async function dismissModal(page: Page): Promise<void> {
  try {
    // Wait for the Dismiss or Close button to appear and click it
    const modalCloseButton = await page.waitForSelector(selectors.easyApplyModalCloseButton, { timeout: 5000 });
    if (modalCloseButton) {
      await modalCloseButton.click();
      console.log('Modal close button clicked, waiting for confirmation dialog...');

      // Wait for any potential dialogs that require confirmation
      await page.waitForTimeout(1000);  // Adjust this based on observed behavior

      // Handle the confirmation dialog if it appears
      const confirmButton = await page.$(selectors.discardApplicationConfirmButton);
      if (confirmButton && await confirmButton.boundingBox() !== null) {  // Check if the button is visible
        await confirmButton.click();
        console.log('Confirmation dialog handled, application discarded.');
      } else {
        console.log('No confirmation dialog appeared, or it was not necessary.');
      }
    } else {
      console.log('No modal close button found, no action needed.');
    }
  } catch (error) {
    console.error('Failed to close modal or handle confirmation:', error);
  }
}

export default dismissModal;
