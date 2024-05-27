import puppeteer from 'puppeteer';
import fs from 'fs';
import config  from '../config'; // Adjust the import path as necessary

const loginLinkedIn = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to LinkedIn login page
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });

  // Enter login credentials from config
  await page.type('#username', config.LINKEDIN_EMAIL);
  await page.type('#password', config.LINKEDIN_PASSWORD);

  // Click login button
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Save cookies
  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));

  await browser.close();
};

loginLinkedIn();
