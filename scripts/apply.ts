import puppeteer, { Page, ElementHandle } from 'puppeteer';
import fs from 'fs';
import config from '../config';
import selectors from '../selectors';
import apply, { ApplicationFormData, Params } from '../apply';
import fetchJobLinksUser from '../fetch/fetchJobLinksUser';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'PAUSE/RESUME> '
});
let paused = false;

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'pause':
      paused = true;
      console.log('Script paused. Type "resume" to continue.');
      break;
    case 'resume':
      paused = false;
      console.log('Script resumed.');
      rl.prompt();
      break;
    default:
      console.log(`Say 'pause' to pause or 'resume' to resume.`);
      rl.prompt();
      break;
  }
}).on('close', () => {
  console.log('Readline closed.');
  process.exit(0);
});

async function waitForResume() {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (!paused) {
        clearInterval(interval);
        resolve();
      }
    }, 100); // Checks every 100 milliseconds
  });
}

const manageCookies = async (page: Page): Promise<boolean> => {
  if (fs.existsSync('cookies.json')) {
    const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
    await page.setCookie(...cookies);
    console.log('Cookies loaded successfully');
    return true;
  } else {
    console.log('No cookies found');
    return false;
  }
};

async function hasApplied(page: Page): Promise<boolean> {
  try {
    const appliedText = await page.$eval('.artdeco-inline-feedback__message', el => el.textContent || '');
    return appliedText.includes('Applied');
  } catch (error) {
    // If the element does not exist, return false indicating not applied
    return false;
  }
}

const saveCookies = async (page: Page): Promise<void> => {
  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
  console.log('Cookies saved successfully');
};

const clickEasyApplyButton = async (easyApplyButton: ElementHandle<Element>): Promise<void> => {
  try {
    await easyApplyButton.click();
    console.log('Easy Apply button clicked.');
  } catch (error) {
    console.error('Error clicking Easy Apply button:', error);
    throw error;
  }
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  const isAlreadyLoggedIn = await manageCookies(page);
  if (!isAlreadyLoggedIn) {
    console.log('Performing login...');
    // Implement your login logic here
    await saveCookies(page);
  }

  const searchParams = {
    page: page,
    location: config.LOCATION,
    keywords: config.KEYWORDS,
    workplace: {
      remote: config.WORKPLACE.REMOTE,
      onSite: config.WORKPLACE.ON_SITE,
      hybrid: config.WORKPLACE.HYBRID,
    },
    jobTitle: config.JOB_TITLE,
    jobDescription: config.JOB_DESCRIPTION,
    jobDescriptionLanguages: config.JOB_DESCRIPTION_LANGUAGES
  };

  for await (const [jobLink, jobTitle, companyName, jobElement] of fetchJobLinksUser(searchParams)) {
    console.log(`Applying to job: ${jobTitle} at ${companyName}`);
    await waitForResume();
    if (jobElement) {
      await jobElement.click();
      await page.waitForTimeout(3000);
  
      if (await hasApplied(page)) {
        console.log('Already applied to this job, skipping...');
        continue; // Skip to the next job
      }
  
      try {
        await page.waitForSelector(selectors.easyApplyButtonEnabled, { timeout: 5000 });
        const easyApplyButton = await page.$(selectors.easyApplyButtonEnabled);
        if (easyApplyButton) {
          console.log('Found Easy Apply button, proceeding with application.');
          await clickEasyApplyButton(easyApplyButton);
  
  
        const formData: ApplicationFormData = {
          phone: config.PHONE,
          cvPath: config.CV_PATH,
          homeCity: config.HOME_CITY,
          coverLetterPath: config.COVER_LETTER_PATH,
          yearsOfExperience: config.YEARS_OF_EXPERIENCE,
          languageProficiency: config.LANGUAGE_PROFICIENCY,
          requiresVisaSponsorship: config.REQUIRES_VISA_SPONSORSHIP,
          booleans: config.BOOLEANS,
          textFields: config.TEXT_FIELDS,
          multipleChoiceFields: config.MULTIPLE_CHOICE_FIELDS,
          workAuthorized: 'Yes',
          criminalHistory: 'No',
          salaryExpectation: '50,000',
          noticePeriod: 'Two weeks',
          preferredLanguage: 'English',
          basedProvince: 'Ontario'
        };
  
        // Apply to the job
        await apply({ page, link: jobLink, formData, shouldSubmit: true });

      } else {
        console.log('No Easy Apply button available, may already be applied or not available.');
      }
    } catch (error: unknown) {
      console.log(`Failed to find Easy Apply button within timeout, skipping job: ${(error as Error).message}`);
    }
  } else {
    console.log('Job element not found on page.');
  }
}
  
  await browser.close();
  console.log('All jobs processed, browser closed.');
})();
