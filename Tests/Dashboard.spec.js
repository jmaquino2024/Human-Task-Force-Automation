const { test, chromium } = require('@playwright/test');
const path = require('path');

test('Dashboard Functionality', async () => {
  const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '11.16.16_2');
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

  // await page.pause();
  
  // Click the fifth available cell
  await page.locator('role=cell').nth(6).click();  // Indexing starts from 0
  console.log('Clicked created task request');

  // Get the task heading
  const taskHeading = await page.getByRole('heading').innerText();
  console.log(`Task created with the name: ${taskHeading}`);

  await page.locator('svg[data-slot="icon"].h-6.w-6 > path[d="M6 18 18 6M6 6l12 12"]').click();
  // Click "Load more tasks..." button twice using a loop
  for (let i = 0; i < 2; i++) {
  await page.getByText('Load more tasks...').first().click();
}
  console.log('Clicked "Load More tasks"');

  await page.getByText('Completed').first().click();
  console.log('Clicked on "Completed"');
  await page.waitForTimeout(2000); // 2 seconds delay
  
  await page.getByText('Draft').first().click();
  console.log('Clicked on "Draft"');
  await page.waitForTimeout(2000); // 2 seconds delay

  // This will click the first button in the second row (0-based index)
  await page.getByRole('row').nth(1).getByRole('button').first().click();
// Click the 'Create Template' button
await page.getByRole('button', { name: 'Create Template' }).click();
console.log('Clicked the "Create Template" button.');

// Wait for the 'Done!' button to become visible
await page.waitForSelector('text=Done!', { state: 'visible' });
console.log('"Successfully created template.');

// Proceed to another function
await anotherFunction();

async function anotherFunction() {
}

// Click the second button within the second row
await page.getByRole('row').nth(1).getByRole('button').nth(1).click();

// Step 1: Extract the text from the <strong> element
const strongText = await page.locator('label strong').textContent();
if (strongText) {
    // Clean up any leading/trailing whitespace
    const cleanText = strongText.trim();

    // Step 2: Click on the placeholder and paste the extracted text
    await page.getByPlaceholder('Enter task title to confirm').fill(cleanText);

    // Log the text for confirmation (optional)
    console.log('Pasted text into placeholder:', cleanText);
} else {
    console.log('No text found in the <strong> element.');
}

// Wait for the 'Done!' button to become visible
await page.waitForSelector('text=Done!', { state: 'visible' });
console.log('"Successfully deleted.');

// Proceed to another function
await anotherFunction();

async function anotherFunction() {
}

  await page.getByRole('button', { name: 'Delete Task' }).click();
  
  // Wait for the 'Done!' button to become visible
  await page.waitForSelector('text=Done!', { state: 'visible' });
  console.log('Successfully delete a draft task.')

  
  await page.getByText('Favorite').first().click();
  console.log('Clicked on "Favorite"');
  await page.waitForTimeout(2000); // 2 seconds delay

  await page.getByRole('row').nth(1).getByRole('button').first().click();

  // Step 1: Extract the text from the <strong> element
const strongText1 = await page.locator('label strong').textContent();
if (strongText) {
    // Clean up any leading/trailing whitespace
    const cleanText = strongText1.trim();

    // Step 2: Click on the placeholder and paste the extracted text
    await page.getByPlaceholder('Enter task title to confirm').fill(cleanText);

    // Log the text for confirmation (optional)
    console.log('Pasted text into placeholder:', cleanText);
} else {
    console.log('No text found in the <strong> element.');
}

await page.getByRole('button', { name: 'Delete Task' }).click();

// Wait for the 'Done!' button to become visible
await page.waitForSelector('text=Done!', { state: 'visible' });
console.log('Successfully delete a created favorite task.')

// Proceed to another function
await anotherFunction();

async function anotherFunction() {
}
  
  await page.getByText('Open').first().click();
  console.log('Clicked on "Open" again');
  await page.waitForTimeout(2000); // 2 seconds delay

  await page.getByRole('row').nth(1).getByRole('button').first().click();

  await page.getByRole('button', { name: 'Create Template' }).click();
  
  // Wait for the 'Done!' button to become visible
  await page.waitForSelector('text=Done!', { state: 'visible' });
  console.log('Successfully created a task template.');

// Proceed to another function
await anotherFunction();

async function anotherFunction() {
}

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
  await page.getByRole('menuitem', { name: 'Active' }).press('Escape');
  
  await page.locator('header').getByRole('button').first().click();
  console.log('Clicked on the first notification button');

  await page.getByRole('button', { name: 'View More' }).click();
  console.log('Clicked View More');
  await page.locator('li').filter({ hasText: 'The Secret Chamber MysteriesThe assistant that selected this task decided to' }).getByRole('link').click();
  // Locate the SVG element by its unique class and attributes
  await page.locator('svg[data-slot="icon"].h-6.w-6 > path[d="M6 18 18 6M6 6l12 12"]').click();

  const page1Promise = page.waitForEvent('popup');
  await page.getByText('Learn Crypto/Web3').click();
  const page1 = await page1Promise;
  console.log('Clicked "Learn Crypto/Web3" link.');

  // Add a delay to view the page before checking for the link
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed

  // Verify if the "humanDAO Academy" link is present
  const isLinkPresent = await page1.locator('role=link', { name: 'humanDAO Academy' }).count();
  if (isLinkPresent > 0) {
    console.log('The "humanDAO Academy" link is available on the new page.');
  } else {
    console.error('Error: The "humanDAO Academy" link is not available on the new page.');
  }

  // Close the new page
  await page1.close();
  console.log('Closed "Learn Crypto/Web3" page.');

  const page2Promise = page.waitForEvent('popup');
  await page.getByText('Get $HDAO').click();
  const page2 = await page2Promise;
  console.log('Clicked "Get $HDAO" link.');

  // Wait for the new page to load
  await page2.waitForLoadState('load');
  console.log('Loaded "Get $HDAO" page.');

  // Add a delay to view the page before checking for the link
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed

  // Verify if the "logo HDAO" link is present
  const isLogoLinkPresent = await page2.locator('role=link', { name: 'logo HDAO' }).count();
  if (isLogoLinkPresent > 0) {
    console.log('The "logo HDAO" link is available on the new page.');
  } else {
    console.error('Error: The "logo HDAO" link is not available on the new page.');
  }

  // Close the new page
  await page2.close();
  console.log('Closed "Get $HDAO" page.');

  const page3Promise = page.waitForEvent('popup');
  await page.locator('a').filter({ hasText: 'Ask Ally - AI Assisted help' }).click();
  const page3 = await page3Promise;
  console.log('Clicked "Ask Ally - AI Assisted help" link.');

  // Wait for the new page to load
  await page3.waitForLoadState('load');
  console.log('Loaded "Ask Ally - AI Assisted help" page.');

  // Add a delay to view the page before checking for the heading
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed

  // Verify if the heading "AI-assisted help desk for HTF" is present
  const isHeadingPresent = await page3.locator('role=heading', { name: 'AI-assisted help desk for HTF' }).count();
  if (isHeadingPresent > 0) {
    console.log('The heading "AI-assisted help desk for HTF" is available on the new page.');
  } else {
    console.error('Error: The heading "AI-assisted help desk for HTF" is not available on the new page.');
  }

  // Close the new page
  await page3.close();
  console.log('Closed "Ask Ally - AI Assisted help" page.');

  console.log('Test completed.');
  // Close the browser context
  await browserContext.close();
  
});