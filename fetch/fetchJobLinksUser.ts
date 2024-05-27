import { ElementHandle, Page } from 'puppeteer';
import buildUrl from '../utils/buildUrl';
import wait from '../utils/wait';
import selectors from '../selectors';
import { waitForElement } from '../utils/waitForLoadScreen';

const MAX_PAGE_SIZE = 25;

async function getJobSearchMetadata({ page, location, keywords }: { page: Page, location: string, keywords: string }) {
  await page.goto('https://linkedin.com/jobs', { waitUntil: 'load' });

  // Wait for job search elements to appear
  await waitForElement(page, selectors.keywordInput, 60000);
  await waitForElement(page, selectors.locationInput, 60000);

  await page.type(selectors.keywordInput, keywords);
  await page.$eval(selectors.locationInput, (el, location) => (el as HTMLInputElement).value = location, location);
  await page.type(selectors.locationInput, ' ');
  await page.$eval('button.jobs-search-box__submit-button', (el) => el.click());
  await page.waitForFunction(() => new URLSearchParams(document.location.search).has('geoId'));

  const geoId = await page.evaluate(() => new URLSearchParams(document.location.search).get('geoId'));

  const numJobsHandle = await page.waitForSelector(selectors.searchResultListText, { timeout: 5000 }) as ElementHandle<HTMLElement>;
  const numAvailableJobs = await numJobsHandle.evaluate((el) => parseInt((el as HTMLElement).innerText.replace(',', '')));

  console.log(`GeoId: ${geoId}, Available Jobs: ${numAvailableJobs}`);

  return {
    geoId,
    numAvailableJobs
  };
}

interface PARAMS {
  page: Page;
  location: string;
  keywords: string;
  workplace: { remote: boolean; onSite: boolean; hybrid: boolean };
  jobTitle: string;
  jobDescription: string;
  jobDescriptionLanguages: string[];
}

async function* fetchJobLinksUser({
  page,
  location,
  keywords,
  workplace: { remote, onSite, hybrid },
  jobTitle,
  jobDescription,
  jobDescriptionLanguages,
}: PARAMS): AsyncGenerator<[string, string, string, ElementHandle<Element> | null]> {
  let numSeenJobs = 0;
  const fWt = [onSite, remote, hybrid].reduce((acc, c, i) => (c ? [...acc, i + 1] : acc), [] as number[]).join(',');

  const { geoId, numAvailableJobs } = await getJobSearchMetadata({ page, location, keywords });

  const searchParams: { [key: string]: string } = {
    keywords,
    location,
    start: numSeenJobs.toString(),
    f_WT: fWt,
    f_AL: 'true',
  };

  if (geoId) {
    searchParams.geoId = geoId.toString();
  }

  const url = buildUrl('https://www.linkedin.com/jobs/search', searchParams);

  while (numSeenJobs < numAvailableJobs) {
    url.searchParams.set('start', numSeenJobs.toString());

    await page.goto(url.toString(), { waitUntil: 'load' });

    console.log(`Fetching job listings from ${url.toString()}`);

    await page.waitForSelector(`${selectors.searchResultListItem}:nth-child(${Math.min(MAX_PAGE_SIZE, numAvailableJobs - numSeenJobs)})`, { timeout: 60000 });

    const jobListings = await page.$$(selectors.searchResultListItem);

    console.log(`Found ${jobListings.length} job listings`);

    for (let i = 0; i < Math.min(jobListings.length, MAX_PAGE_SIZE); i++) {
      try {
        const jobListing = jobListings[i];
        const jobLink = await jobListing.$eval(selectors.searchResultListItemLink, el => (el as HTMLAnchorElement).href);
        const jobTitle = await jobListing.$eval(selectors.searchResultListItemLink, el => el.textContent?.trim() ?? 'Unknown title');
        const companyName = await jobListing.$eval(selectors.searchResultListItemCompanyName, el => el.textContent?.trim() ?? 'Unknown company');
        yield [jobLink, jobTitle, companyName, jobListing];
      } catch (e) {
        console.log(`Error processing job listing ${i}:`, e);
      }
    }

    await wait(2000);

    numSeenJobs += jobListings.length;
  }
}

export default fetchJobLinksUser;
