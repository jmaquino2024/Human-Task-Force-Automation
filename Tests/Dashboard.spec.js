const { test, chromium } = require('@playwright/test');
const path = require('path');

test('Dashboard Functionality', async () => {
  const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '11.16.14_0');
  const userDataDir = '/tmp/test-user-data-dir';

  // Launch browser with MetaMask extension and set slowMo
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ],
    viewport: null, // Set viewport to null to use the full screen size
    // slowMo: 250 // Add slowMo to introduce 250 milliseconds delay
  });

  // Use an existing page if available
  const pages = browserContext.pages();
  const page = pages.length > 0 ? pages[0] : await browserContext.newPage();

  // Clear cache to mimic hard reload
  await page.context().clearCookies();
  await page.context().clearPermissions();
  await page.goto('about:blank'); // Navigate away to ensure the cache is cleared

  // Navigate to the target URL
  await page.goto('https://develop.humandao.org/');
  
  await page.waitForTimeout(1000); // 1 second delay, adjust as needed

  await page.reload();

  // Perform the login steps
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Email / Password' }).click();
  await page.getByRole('link', { name: 'Login Using your Wallet' }).click();
  await page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click();

  // Wait for Metamask login popup to appear
  const [metamaskPage] = await Promise.all([
    browserContext.waitForEvent('page'),
    await page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click()
  ]);

  await metamaskPage.waitForLoadState();

  // Input password in MetaMask popup
  await metamaskPage.fill('input[type="password"]', 'M1cros-2024@@@');

  // Click "Unlock" button
  await metamaskPage.click('button:has-text("Unlock")');

  // Wait for the account selection screen to appear
  await metamaskPage.waitForSelector('.mm-box.mm-checkbox.mm-text.mm-text--body-md.mm-box--display-inline-flex.mm-box--align-items-center.mm-box--color-text-default');

  // Get all account checkboxes
  const checkboxes = await metamaskPage.$$('.mm-box.mm-checkbox.mm-text.mm-text--body-md.mm-box--display-inline-flex.mm-box--align-items-center.mm-box--color-text-default');

  // Click the first account checkbox
  if (checkboxes.length > 0) {
      await checkboxes[0].click();
  }

  // Click the second account checkbox if it exists
  if (checkboxes.length > 2) {
      await checkboxes[2].click();
  }
  
  // Confirm the connection
  await metamaskPage.click('button:has-text("Next")'); 
  await metamaskPage.click('button:has-text("Confirm")');

  // Wait for the MetaMask confirmation popup to close
  await metamaskPage.waitForSelector('button:has-text("Confirm")', { state: 'detached' });

  // Add a delay to ensure the popup is fully closed
  await page.waitForTimeout(2000); // 1 second delay, adjust as needed

  // Set default timeout for all actions
  page.setDefaultTimeout(10000); // 10 seconds

  // Click the "Sign message" button
  await page.getByRole('button', { name: 'Sign message' }).click();

  // Wait for Metamask sign message popup to appear
  const [signMessagePage] = await Promise.all([
    browserContext.waitForEvent('page'),
    page.waitForSelector('button:has-text("Sign")')
  ]);

  // Click "Sign" button in MetaMask sign message popup
  await signMessagePage.waitForLoadState();
  await signMessagePage.click('button:has-text("Sign")');

  // Wait for navigation to the dashboard URL
  await page.waitForURL('https://develop.humandao.org/app', { timeout: 60000 });
  console.log('Navigated to dashboard.');

  // Wait for a while before performing additional interactions
  await page.waitForTimeout(2000); // 2 seconds delay

  await page.reload();

  // await page.pause();

  // Perform additional interactions with a delay
  console.log('Interacting with Hamburger Menu');
  await page.getByRole('button').nth(3).click();
  console.log('Clicked Hamburger Menu');
  await page.getByLabel('Active').click();
  console.log('Clicked "Active" label.');
  await page.getByLabel('Published').click();
  console.log('Clicked "Published" label.');
  await page.getByLabel('Clarification').click();
  console.log('Clicked "Clarification" label.');
  await page.getByLabel('Review').click();
  console.log('Clicked "Review" label.');
  await page.getByLabel('Draft').click();
  console.log('Clicked "Draft" label.');
  await page.getByLabel('Completed').click();
  console.log('Clicked "Completed" label.');
  await page.getByLabel('Completed').click();
  console.log('Clicked "Completed" label again.');
  await page.getByLabel('Draft').click();
  console.log('Clicked "Draft" label again.');
  await page.getByLabel('Review').click();
  console.log('Clicked "Review" label again.');
  await page.getByRole('menuitem', { name: 'Published' }).click();
  console.log('Clicked "Published" menu item.');
  await page.getByLabel('Active').click();
  console.log('Clicked "Active" label again.');
  await page.locator('html').click();
  await page.getByLabel('', { exact: true }).click();
  await page.getByLabel('', { exact: true }).click();
  await page.locator('html').click();
  await page.getByLabel('', { exact: true }).click();
  await page.getByLabel('', { exact: true }).click();
  await page.getByRole('menuitem', { name: 'Active' }).press('Escape');

  await page.getByText('Open').first().click();
  console.log('Clicked on "Open"');
  await page.waitForTimeout(2000); // 2 seconds delay
  
  await page.getByText('Completed').first().click();
  console.log('Clicked on "Completed"');
  await page.waitForTimeout(2000); // 2 seconds delay
  
  await page.getByText('Draft').first().click();
  console.log('Clicked on "Draft"');
  await page.waitForTimeout(2000); // 2 seconds delay
  
  await page.getByText('Favorite').first().click();
  console.log('Clicked on "Favorite"');
  await page.waitForTimeout(2000); // 2 seconds delay
  
  await page.getByText('Open').first().click();
  console.log('Clicked on "Open" again');
  await page.waitForTimeout(2000); // 2 seconds delay
  
  await page.locator('header').getByRole('button').first().click();
  console.log('Clicked on the first notification button');
  // Wait for a while before performing additional interactions
  await page.waitForTimeout(1000); // 1 seconds delay
  await page.getByLabel('', { exact: true }).press('Escape');

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Learn Crypto/Web3' }).click();
  console.log('Clicked "Learn Crypto/Web3" link.');
  const page1 = await page1Promise;
  await page1.waitForLoadState('load'); // Wait for the page to load
  console.log('Loaded "Learn Crypto/Web3" page.');

  // Add a delay to view the page before closing
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed
  await page1.close();
  console.log('Closed "Learn Crypto/Web3" page.');

  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Get $HDAO' }).click();
  console.log('Clicked "Get $HDAO" link.');
  const page2 = await page2Promise;
  await page2.waitForLoadState('load'); // Wait for the page to load
  console.log('Loaded "Get $HDAO" page.');

  // Add a delay to view the page before closing
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed
  await page2.close();
  console.log('Closed "Get $HDAO" page.');

  const page3Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Ally Ask Ally - AI Assisted' }).click();
  console.log('Clicked "Ally Ask Ally - AI Assisted" link.');
  const page3 = await page3Promise;
  await page3.waitForLoadState('load'); // Wait for the page to load
  console.log('Loaded "Ally Ask Ally - AI Assisted" page.');

  // Add a delay to view the page before closing
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed
  await page3.close();
  console.log('Closed "Ally Ask Ally - AI Assisted" page.');

  await page.waitForTimeout(3000); // 3 seconds delay

  console.log('Test completed.');
  // Close the browser context
  await browserContext.close();
});