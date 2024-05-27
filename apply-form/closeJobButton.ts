import { Page } from 'puppeteer';

async function handleCloseWindowOrModal(page: Page): Promise<void> {
  try {
    const closeButtonSelector = 'button[aria-label="Close"]';  // Adjust this as necessary
    await page.waitForSelector(closeButtonSelector, { timeout: 5000 });
    const closeButtons = await page.$$(closeButtonSelector);
    for (const button of closeButtons) {
      await button.click();  // Click each close button found
      console.log('Clicked a close button.');
    }

    // Optional: Wait for the modal to be removed from the DOM
    await page.waitForFunction(() => !document.querySelector('.your-modal-class'), { timeout: 3000 });
    console.log('Modal or window appears to be closed.');
  } catch (error) {
    console.error('Failed to close modal or window:', error);
  }
}

export default handleCloseWindowOrModal;
