import { Page } from 'puppeteer';

async function waitForLoadScreen(page: Page, loadScreenSelector: string, timeout: number = 60000): Promise<void> {
  const maxWaitTime = timeout;
  const checkInterval = 1000; // 1 second
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const loadScreenVisible = await page.evaluate((selector) => {
      const loadScreen = document.querySelector(selector);
      return loadScreen !== null;
    }, loadScreenSelector);

    if (!loadScreenVisible) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }

  throw new Error('Load screen did not disappear within the timeout period');
}

async function waitForElement(page: Page, selector: string, timeout: number = 60000): Promise<void> {
  try {
    await page.waitForSelector(selector, { timeout });
  } catch {
    throw new Error(`No element found for selector: ${selector}`);
  }
}

export { waitForLoadScreen, waitForElement };
