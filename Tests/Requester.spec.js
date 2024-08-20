const { test, chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs'); // Ensure fs is imported

async function performLogin(page, browserContext) {
  // Perform the login steps
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Email / Password' }).click();
  await page.getByRole('link', { name: 'Login Using your Wallet' }).click();
  await page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click();

  // Wait for Metamask login popup to appear
  const [metamaskPage] = await Promise.all([
    browserContext.waitForEvent('page'),
    page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click()
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
  await page.waitForTimeout(2000); // 2 second delay, adjust as needed

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

  console.log('Logged in successfully.');
}

test('Connecting Your Wallet', async () => {
  const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '11.16.16_2');
  const userDataDir = '/tmp/test-user-data-dir';

  // Launch browser with MetaMask extension
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ],
    viewport: null, // Set viewport to null to use the full screen size
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
  await performLogin(page, browserContext);

  // Wait for a while before logging out
  await page.waitForTimeout(3000); // 3 seconds delay

  // Perform logout
  await page.getByRole('button', { name: '0xfB8....719' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  console.log('Logged out successfully.');

  // Wait for the next page to load completely
  await page.waitForLoadState('load');

  // Add a delay to view the next page before closing the browser
  await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay (adjust as needed)

  // Close the browser
  await browserContext.close();
});

test('Profile Update', async () => {
  const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '11.16.16_2');
  const userDataDir = '/tmp/test-user-data-dir';

  // Generate a random name
  const randomName = 'User' + Math.floor(Math.random() * 10000);

  // Launch browser with MetaMask extension
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
          `--disable-extensions-except=${pathToExtension}`,
          `--load-extension=${pathToExtension}`
      ],
      viewport: null // Set viewport to null to use the full screen size
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

  // Reload the page
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
  await page.waitForTimeout(2000); // 2 second delay, adjust as needed

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
  await page.waitForURL('https://develop.humandao.org/app');

  await page.waitForLoadState('load');

  // await page.pause();

  // Click to navigate to the profile section
  await page.getByRole('button', { name: '0xfB8....719' }).click();
  await page.getByRole('link', { name: 'Profile' }).click();

  await page.getByRole('img', { name: 'change profile button' }).click();

    // Randomly select and click one of the profile pictures
    const randomPictureIndex = Math.floor(Math.random() * 9) + 2;
    await page.locator(`div:nth-child(${randomPictureIndex}) > .size-\\[125px\\]`).click();
    console.log(`Selected random profile picture: ${randomPictureIndex}`);
    await page.getByRole('button', { name: 'Update profile' }).click();
    console.log('Changed profile picture successfully');
    
    // Wait for a while before performing additional interactions
    await page.waitForTimeout(2000); // 2 seconds delay

  // Fill out profile details
  await page.getByPlaceholder('Your display name').click();
  await page.getByPlaceholder('Your display name').fill(randomName);
  console.log(`Changed display name to: ${randomName}`);

  // Check to see if the email is visible.
  await page.getByText('Email address').click();
  await page.getByPlaceholder('Your email address').click();
  console.log('Email address is visible but not editable.');

  const email = 'john.marvin.a.quino+87@gmail.com';

  // Fill out notification email
  await page.getByPlaceholder('Your email address').click();
  await page.getByPlaceholder('Setup a notification email').click();
  await page.getByPlaceholder('Setup a notification email').fill(email);
  console.log(`Filled out notification email: ${email}`);
  
  // Get the checkbox element
  const sendNotificationsCheckbox = await page.getByLabel('Send email notifications');

  // Check if the checkbox is currently checked
  const isChecked = await sendNotificationsCheckbox.isChecked();

  // Perform tick if it's not already checked
  if (!isChecked) {
      await sendNotificationsCheckbox.check();
      console.log('Checked "Send email notifications"');
  }

  // Wait for a moment (optional)
  await page.waitForTimeout(1000);

  // Perform untick
  await sendNotificationsCheckbox.uncheck();
  console.log('Unchecked "Send email notifications"');

  // Perform tick again
  await sendNotificationsCheckbox.check();
  console.log('Checked "Send email notifications" again');

  // Click to open the country selection
  await page.getByLabel('Your Country').click();
  await page.getByPlaceholder('Search country...').click();

  // Fetch all available country options
  const countryOptions = await page.$$eval('[role="option"]', options => options.map(option => option.textContent));

  // Select a random country from the list
  const randomCountry = countryOptions[Math.floor(Math.random() * countryOptions.length)];

  // Fill the search input with the random country and select it
  await page.getByPlaceholder('Search country...').fill(randomCountry);
  await page.getByRole('option', { name: randomCountry }).click();
  console.log(`Selected ${randomCountry} as country`);

  // Preferred Language selection between Filipino and English
  const languages = ['Tagalog / Filipino', 'English'];
  const selectedLanguage = languages[Math.floor(Math.random() * languages.length)];

  await page.getByLabel('Preferred Language for').click();
  await page.getByPlaceholder('Search language...').click();
  await page.getByPlaceholder('Search language...').fill(selectedLanguage === 'Tagalog / Filipino' ? 'filip' : 'english');
  await page.getByRole('option', { name: selectedLanguage }).click();
  console.log(`Selected ${selectedLanguage} as preferred language`);

  await page.getByPlaceholder('Tell us a little bit about').click();
  await page.getByPlaceholder('Tell us a little bit about').fill('Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
  console.log('Filled out bio');

  // Click the button to save changes
  await page.getByRole('button', { name: 'Save Changes' }).click();
  console.log('Clicked "Save Changes"');

  // Connect Discord
  console.log('Connecting Discord...');
  await page.getByRole('button', { name: 'Connect Discord' }).click();
  await page.getByPlaceholder('Enter your handle').click();
  await page.getByPlaceholder('Enter your handle').fill(randomName);
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  console.log('Discord handle updated and closed.');

  // Connect Twitter
  console.log('Connecting Twitter...');
  await page.getByRole('button', { name: 'Connect X (Twitter)' }).click();
  await page.getByPlaceholder('Enter your handle').click();
  await page.getByPlaceholder('Enter your handle').fill(randomName);
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  console.log('Twitter handle updated and closed.');

  // Connect LinkedIn
  console.log('Connecting LinkedIn...');
  await page.getByRole('button', { name: 'Connect Linkedin' }).click();
  await page.getByPlaceholder('Enter your handle').click();
  await page.getByPlaceholder('Enter your handle').fill(randomName);
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  console.log('LinkedIn handle updated and closed.');

  // Wait for 30 seconds to ensure the changes are saved
  await page.waitForTimeout(5000);

  // Close the browser
  await browserContext.close();
  
});

test.only('Dashboard Functionality', async () => {
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
console.log('Successfully created template.');

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

test('Assets-Deposit', async () => {
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
    page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click()
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
  await page.waitForTimeout(2000); // 2 second delay, adjust as needed

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

  // Wait for a while before logging out
  await page.waitForTimeout(2000); // 2 seconds delay

  // await page.pause();

  await page.getByRole('button', { name: '0xfB8....719' }).click();
  await page.getByRole('button', { name: 'Assets' }).click();
  await page.getByRole('button', { name: 'Deposit' }).click();

  // Define the conversion rate
  const conversionRate = 2.50;

  // Read the last input value from the file
  let lastValue;
  try {
    lastValue = parseInt(fs.readFileSync('lastValue.txt', 'utf8'), 10);
  } catch (error) {
    // If the file doesn't exist or is empty, start with 0
    lastValue = 0;
  }

  // Determine the next value to use
  let inputValue = lastValue + 1;
  if (inputValue > 50) {
    inputValue = 1;
  }

  // Fill the placeholder field with the current input value
  await page.getByPlaceholder('100').fill(inputValue.toString());

  // Calculate the expected value
  const expectedValue = (inputValue * conversionRate).toFixed(2); // For example: 2 ENRG * 2.50 = 5.00

  // Wait for the conversion value to appear
  await page.waitForSelector('.text-card-text');

  // Get the conversion value text
  const conversionValueElement = await page.$('.text-card-text');
  const conversionValueText = await conversionValueElement.textContent();

  // Extract numeric value using regular expression
  const regexMatch = conversionValueText.match(/Total Value of USDC\.e:\s*([\d.]+)/);
  const foundValue = regexMatch ? parseFloat(regexMatch[1]) : NaN;

// Verify the conversion value
if (!isNaN(foundValue) && foundValue === parseFloat(expectedValue)) {
  console.log(`Correct conversion for input ${inputValue} (USDC.e): ${foundValue}`);
} else {
  console.error(`Incorrect conversion for input ${inputValue} (USDC.e). Expected: ${expectedValue}, Got: ${foundValue}`);
}

  // Save the new input value to the file
  fs.writeFileSync('lastValue.txt', inputValue.toString());

  // Perform the conversion (assuming this clicks the "Convert" button)
  await page.getByRole('button', { name: 'Convert', exact: true }).click();

  // Wait for Metamask login popup to appear
  const [metamaskPage1] = await Promise.all([
    browserContext.waitForEvent('page'),
  ]);

  await metamaskPage1.waitForLoadState();

  // Ensure MetaMask popup is fully loaded
  await metamaskPage1.waitForSelector('button:has-text("Next")');

  // Click "Next" button in MetaMask popup
  await metamaskPage1.click('button:has-text("Next")');

  // Wait for "Approve" button to appear
  await metamaskPage1.waitForSelector('button:has-text("Approve")');

  // Click "Approve" button in MetaMask popup
  await metamaskPage1.click('button:has-text("Approve")');

  // Add a delay to allow MetaMask confirmation popup to appear
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the second MetaMask popup to appear
  const [metamaskPage2] = await Promise.all([
    browserContext.waitForEvent('page'), // Wait for the second popup to be created
  ]);

  await metamaskPage2.waitForLoadState();

  // Click "Confirm" button in MetaMask popup
  await metamaskPage2.click('button:has-text("Confirm")');

  // Wait for the "Waiting" element to become visible
  try {
    await page.waitForSelector('text="Waiting"', { visible: true, timeout: 60000 });
    // Click on "Waiting" element if it appears
    await page.click('text="Waiting"');
  } catch (error) {
    console.error('Waiting element not found within timeout.');
  }

  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the text "Successfully Purchased $Enrg" to be visible with an extended timeout
  try {
    await page.waitForSelector('text="Successfully Purchased $Enrg"', { visible: true, timeout: 120000 });
  } catch (error) {
    console.error('Successfully Purchased $Enrg element not found within timeout.');
  }

  // Click "Close" button
  await page.getByRole('button', { name: 'Close' }).click();

  // Add a delay to view the page after clicking the "Close" button
  await page.waitForTimeout(2000); // 2 seconds delay, adjust as needed

  // USDT Conversion
  await page.locator('button').filter({ hasText: 'USDC.e' }).click();
  await page.getByLabel('USDT').click();

  // Define the conversion rate for USDT
  const usdtConversionRate = 2.50;

  // Read the last input value from the file
  let usdtLastValue;
  try {
    usdtLastValue = parseInt(fs.readFileSync('lastValue.txt', 'utf8'), 10);
  } catch (error) {
    // If the file doesn't exist or is empty, start with 0
    usdtLastValue = 0;
  }

  // Determine the next value to use
  let usdtInputValue = usdtLastValue + 1;
  if (usdtInputValue > 100) {
    usdtInputValue = 51;
  }

  // Fill the placeholder field with the current input value
  await page.getByPlaceholder('100').fill(usdtInputValue.toString());

  // Calculate the expected value
  const usdtExpectedValue = (usdtInputValue * usdtConversionRate).toFixed(2); // For example: 2 ENRG * 2.50 = 5.00

  // Wait for the conversion value to appear
  await page.waitForSelector('.text-card-text');

  // Get the conversion value text
  const usdtConversionValueElement = await page.$('.text-card-text');
  const usdtConversionValueText = await usdtConversionValueElement.textContent();

  // Extract numeric value using regular expression
  const usdtRegexMatch = usdtConversionValueText.match(/Total Value of USDT:\s*([\d.]+)/);
  const usdtFoundValue = usdtRegexMatch ? parseFloat(usdtRegexMatch[1]) : NaN;

// Verify the conversion value
if (!isNaN(usdtFoundValue) && usdtFoundValue === parseFloat(usdtExpectedValue)) {
  console.log(`Correct conversion for input ${usdtInputValue} (USDT): ${usdtFoundValue}`);
} else {
  console.error(`Incorrect conversion for input ${usdtInputValue} (USDT). Expected: ${usdtExpectedValue}, Got: ${usdtFoundValue}`);
}

  // Save the new input value to the file
  fs.writeFileSync('lastValue.txt', usdtInputValue.toString());

  // Perform the conversion (assuming this clicks the "Convert" button)
  await page.getByRole('button', { name: 'Convert', exact: true }).click();

  // Wait for Metamask login popup to appear
  const [metamaskPage3] = await Promise.all([
    browserContext.waitForEvent('page'),
  ]);

  await metamaskPage3.waitForLoadState();

  // Ensure MetaMask popup is fully loaded
  await metamaskPage3.waitForSelector('button:has-text("Next")');

  // Click "Next" button in MetaMask popup
  await metamaskPage3.click('button:has-text("Next")');

  // Wait for "Approve" button to appear
  await metamaskPage3.waitForSelector('button:has-text("Approve")');

  // Click "Approve" button in MetaMask popup
  await metamaskPage3.click('button:has-text("Approve")');

  // Add a delay to allow MetaMask confirmation popup to appear
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the second MetaMask popup to appear
  const [metamaskPage4] = await Promise.all([
    browserContext.waitForEvent('page'), // Wait for the second popup to be created
  ]);

  await metamaskPage4.waitForLoadState();

  // Click "Confirm" button in MetaMask popup
  await metamaskPage4.click('button:has-text("Confirm")');

  // Wait for the "Waiting" element to become visible
  try {
    await page.waitForSelector('text="Waiting"', { visible: true, timeout: 60000 });
    // Click on "Waiting" element if it appears
    await page.click('text="Waiting"');
  } catch (error) {
    console.error('Waiting element not found within timeout.');
  }

  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the text "Successfully Purchased $Enrg" to be visible with an extended timeout
  try {
    await page.waitForSelector('text="Successfully Purchased $Enrg"', { visible: true, timeout: 120000 });
  } catch (error) {
    console.error('Successfully Purchased $Enrg element not found within timeout.');
  }

  // Click "Close" button
  await page.getByRole('button', { name: 'Close' }).click();

  // Add a delay to view the page after clicking the "Close" button
  await page.waitForTimeout(2000); // 2 seconds delay, adjust as needed

  // Close the browser
  await browserContext.close();

});

test('Assets-Withdraw', async () => {
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

  // await page.pause()

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
  await page.waitForTimeout(2000); // 2 second delay, adjust as needed

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

  // Wait for a while before logging out
  await page.waitForTimeout(2000); // 2 seconds delay

  // await page.pause()

  await page.getByRole('button', { name: '0xfB8....719' }).click();
  await page.getByRole('button', { name: 'Assets' }).click();
  await page.getByRole('button', { name: 'Withdraw' }).click();
  
  const fs = require('fs');
  
  // Read the last input value from the file
  let lastValue;
  try {
      lastValue = parseInt(fs.readFileSync('lastValue.txt', 'utf8'), 10);
  } catch (error) {
      // If the file doesn't exist or is empty, start with 2
      lastValue = 2;
  }
  
  // Increment the value
  let inputValue = lastValue + 1;
  if (inputValue > 25) {
      inputValue = 3;
  }
  
  // Save the new input value to the file
  fs.writeFileSync('lastValue.txt', inputValue.toString());
  
  // Ensure the coin is USDC.e before proceeding
  let selectedCoin = await page.locator('button').filter({ hasText: 'USDC.e' }).textContent();
  if (selectedCoin.trim() !== 'USDC.e') {
      throw new Error('Failed to select USDC.e');
  }
  
  // Use the inputValue in your code
  await page.getByPlaceholder('100').click();
  await page.getByPlaceholder('100').fill(inputValue.toString());
  
  // Wait for the conversion value to appear
  await page.waitForSelector('.text-card-text');
  
  // Get the conversion value text
  const conversionValueElement = await page.$('.text-card-text');
  const conversionValueText = await conversionValueElement.textContent();
  
  // Calculate the expected conversion value
  const expectedValue = (inputValue * 2).toFixed(2); // Each $ENRG token is worth $2
  
  // Extract the numeric value using a more specific approach
  const conversionMatch = conversionValueText.match(/You receive: (\d+)\$/);
  const foundValue = conversionMatch ? parseFloat(conversionMatch[1]) : NaN;
  
  // Verify the conversion value
  if (!isNaN(foundValue) && foundValue === parseFloat(expectedValue)) {
      console.log(`Conversion value is correct for input ${inputValue} (USDC.e): ${foundValue}`);
  } else {
      console.error(`Conversion value is incorrect for input ${inputValue} (USDC.e). Expected: ${expectedValue}, Found: ${foundValue}`);
  }
  
  // Ensure the coin is still USDC.e before proceeding with the conversion
  selectedCoin = await page.locator('button').filter({ hasText: 'USDC.e' }).textContent();
  if (selectedCoin.trim() !== 'USDC.e') {
      throw new Error('Coin changed from USDC.e before conversion');
  }
  
  // Perform the conversion (assuming this clicks the "Convert" button)
  await page.getByRole('button', { name: 'Convert', exact: true }).click();
  
  // Wait for Metamask login popup to appear
  const [metamaskPage1] = await Promise.all([
      browserContext.waitForEvent('page'),
  ]);
  
  await metamaskPage1.waitForLoadState();
  
  // Click "Confirm" button in MetaMask popup
  await metamaskPage1.click('button:has-text("Confirm")');
  
  // Wait for the "Waiting" element to become visible
  try {
      await page.waitForSelector('text="Waiting"', { visible: true, timeout: 60000 });
      // Click on "Waiting" element if it appears
      await page.click('text="Waiting"');
  } catch (error) {
      console.error('Waiting element not found within timeout.');
  }
  
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed
  
  // Wait for the text "Successfully Converted" to be visible with an extended timeout
  try {
      await page.waitForSelector('text="Transaction Complete"', { visible: true, timeout: 30000 });
  } catch (error) {
      console.error('Transaction Complete element not found within timeout.');
  }
  
  // Click "Close" button
  await page.getByRole('button', { name: 'Close' }).click();
  
  // Add a delay to view the page after clicking the "Close" button
  await page.waitForTimeout(2000); // 2 seconds delay, adjust as needed
  
  // Ensure the coin is still USDC.e after the transaction
  selectedCoin = await page.locator('button').filter({ hasText: 'USDC.e' }).textContent();
  if (selectedCoin.trim() !== 'USDC.e') {
      throw new Error('Coin changed from USDC.e after transaction');
  }
  
// Select USDT for the next conversion
await page.locator('button').filter({ hasText: 'USDC.e' }).click();
await page.getByText('USDT').click();

// Increment the value for the next conversion
inputValue = inputValue + 1;
if (inputValue > 10) {
  inputValue = 3;
}

// Save the new input value to the file
fs.writeFileSync('lastValue.txt', inputValue.toString());

// Use the inputValue in your code for the next conversion
await page.getByPlaceholder('100').click();
await page.getByPlaceholder('100').fill(inputValue.toString());

// Wait for the conversion value to appear
await page.waitForSelector('.text-card-text');

// Get the conversion value text
const conversionValueElement2 = await page.$('.text-card-text');
const conversionValueText2 = await conversionValueElement2.textContent();

// Extract the numeric value using a more specific approach
const conversionMatch2 = conversionValueText2.match(/You receive: (\d+)\$/);
const foundValue2 = conversionMatch2 ? parseFloat(conversionMatch2[1]) : NaN;

// Calculate the expected conversion value
const expectedValue2 = (inputValue * 2).toFixed(2); // Each $ENRG token is worth $2

// Verify the conversion value
if (!isNaN(foundValue2) && foundValue2 === parseFloat(expectedValue2)) {
  console.log(`Conversion value is correct for input ${inputValue} (USDT): ${foundValue2}`);
} else {
  console.error(`Conversion value is incorrect for input ${inputValue} (USDT). Expected: ${expectedValue2}, Found: ${foundValue2}`);
}

// Ensure the coin is still USDT before proceeding with the conversion
selectedCoin = await page.locator('button').filter({ hasText: 'USDT' }).textContent();
if (selectedCoin.trim() !== 'USDT') {
  throw new Error('Coin changed from USDT before conversion');
}

// Perform the conversion (assuming this clicks the "Convert" button)
await page.getByRole('button', { name: 'Convert', exact: true }).click();

// Wait for Metamask login popup to appear
const [metamaskPage2] = await Promise.all([
  browserContext.waitForEvent('page'),
]);

await metamaskPage2.waitForLoadState();

// Click "Confirm" button in MetaMask popup
await metamaskPage2.click('button:has-text("Confirm")');

// Wait for the "Waiting" element to become visible
try {
  await page.waitForSelector('text="Waiting"', { visible: true, timeout: 60000 });
  // Click on "Waiting" element if it appears
  await page.click('text="Waiting"');
} catch (error) {
  console.error('Waiting element not found within timeout.');
}

await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

// Wait for the text "Successfully Converted" to be visible with an extended timeout
try {
  await page.waitForSelector('text="Transaction Complete"', { visible: true, timeout: 30000 });
} catch (error) {
  console.error('Transaction Complete element not found within timeout.');
}

// Click "Close" button
await page.getByRole('button', { name: 'Close' }).click();

// Add a delay to view the page after clicking the "Close" button
await page.waitForTimeout(2000); // 2 seconds delay, adjust as needed

// Close the browser
await browserContext.close();

});

function generateRandomTitle() {
  const titles = [
    'The Adventure Begins',
    'Mystery of the Lost City',
    'Journey to the Unknown',
    'Secrets of the Ancient World',
    'The Quest for the Golden Treasure',
    "Whispers of the Forgotten",
    "Echoes in the Mist",
    "The Secret Garden Gate",
    "Shadows of the Crescent Moon",
    "Lost in Time's Embrace",
    "Beneath the Starlit Sky",
    "Whispers of the Enchanted Forest",
    "Echoes from the Forgotten Realm",
    "The Hidden Pathway",
    "Chronicles of the Midnight Sun",
    "Mysteries of the Sapphire Isle",
    "Beyond the Horizon's Edge",
    "Songs of the Whispering Wind",
    "Legends of the Northern Lights",
    "The Enigma of Evermore",
    "Tales from the Emerald Vale",
    "Echoes of the Ancient Ruins",
    "Whispers of the Moonlit Meadow",
    "The Secret Chamber Mysteries",
    "Crimson Skies Over Avalon",
    "Whispers of the Lost City",
    "The Forgotten Kingdom Chronicles",
  ];
  const randomIndex = Math.floor(Math.random() * titles.length);
  return titles[randomIndex];
}

test('Task Creation', async () => {
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
    page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click()
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
  await page.waitForTimeout(2000); // 2 second delay, adjust as needed

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

  // Wait for a while before logging out
  await page.waitForTimeout(2000); // 2 seconds delay

  // await page.pause();

  // Highlighted modification
  const fs = require('fs');

  // Read the last input value from the file
  let lastValue;
  try {
    lastValue = parseInt(fs.readFileSync('lastValue.txt', 'utf8'), 10);
  } catch (error) {
    // If the file doesn't exist or is empty, start with 0
    lastValue = 0;
  }

  // Determine the next value to use
  let inputValue = lastValue + 1;
  if (inputValue > 25) {
    inputValue = 1;
  }

  // Create a new task
  await page.getByRole('button', { name: 'Create Task' }).click();
  console.log('Clicked on "Create Task" button');

  await page.getByRole('menuitem', { name: 'New Task' }).click();
  console.log('Selected "New Task" from the menu');

  await page.getByPlaceholder('Enter title').click();
  console.log('Clicked on title input field');

  // Generate and fill a random title
  const randomTitle = generateRandomTitle();
  await page.getByPlaceholder('Enter title').fill(randomTitle);
  console.log(`Filled title input field with random title: ${randomTitle}`);

  // Fill the "Enter Energy" field with the current input value
  await page.getByPlaceholder('Enter Energy').click();
  await page.getByPlaceholder('Enter Energy').fill(inputValue.toString());
  console.log(`Filled "Enter Energy" field with value: ${inputValue}`);

  // Save the new input value to the file
  fs.writeFileSync('lastValue.txt', inputValue.toString());

  // // Schedule Task with current date
  // await page.getByLabel('Schedule Task').click();

  // // Get the current date
  // const currentDate = new Date();
  // const day = currentDate.getDate();
  // const dayString = day.toString();

  // // Click the current date in the date picker
  // await page.getByRole('gridcell', { name: dayString }).click();

  await page.getByLabel('Qualification').click();
  console.log('Clicked on "Qualification"');

  await page.getByLabel('Public Qual', { exact: true }).click();
  console.log('Selected "Public Qual"');

  await page.locator('.tiptap').click();
  await page.locator('.tiptap').fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur vestibulum nisi at ultricies. Duis consequat nec quam eget feugiat.');
  console.log('Filled the description field with placeholder text');

  await page.locator('label').filter({ hasText: 'Video References' }).getByRole('button').click();
  console.log('Clicked on "Video References" button');

  await page.locator('input[name="videoRefs\\.0\\.value"]').click();
  await page.locator('input[name="videoRefs\\.0\\.value"]').fill('https://www.youtube.com/watch?v=8oFEp-_iT98&t=2s');
  console.log('Filled first video reference input');

  await page.locator('input[name="videoRefs\\.1\\.value"]').click();
  await page.locator('input[name="videoRefs\\.1\\.value"]').fill('https://www.youtube.com/watch?v=8oFEp-_iT98&t=2s');
  console.log('Filled second video reference input');

  await page.locator('div').filter({ hasText: /^Video ReferencesVideo References$/ }).getByRole('button').nth(2).click();
  console.log('Clicked to removed the video references');

  await page.locator('label').filter({ hasText: 'URL\'s' }).getByRole('button').click();
  console.log('Clicked on "URL\'s" button');

  await page.locator('input[name="links\\.0\\.value"]').click();
  await page.locator('input[name="links\\.0\\.value"]').fill('https://www.google.com/');
  console.log('Filled first URL input');

  await page.locator('input[name="links\\.1\\.value"]').click();
  await page.locator('input[name="links\\.1\\.value"]').fill('https://www.google.com/');
  console.log('Filled second URL input');

  await page.locator('div').filter({ hasText: /^URL'sURL's$/ }).getByRole('button').nth(2).click();
  console.log('Clicked to removed the URLs');

  await page.getByRole('button', { name: 'Save Task' }).click();
  console.log('Clicked on "Save Task" button');

  await page.getByRole('button', { name: 'Publish' }).click();
  console.log('Clicked on "Publish" button');

  // Wait for Metamask login popup to appear
  const [metamaskPage1] = await Promise.all([
    browserContext.waitForEvent('page'),
  ]);

  await metamaskPage1.waitForLoadState();

  // Ensure MetaMask popup is fully loaded
  await metamaskPage1.waitForSelector('button:has-text("Next")');

  // Click "Next" button in MetaMask popup
  await metamaskPage1.click('button:has-text("Next")');

  // Wait for "Approve" button to appear
  await metamaskPage1.waitForSelector('button:has-text("Approve")');

  // Click "Approve" button in MetaMask popup
  await metamaskPage1.click('button:has-text("Approve")');

  // Add a delay to allow MetaMask confirmation popup to appear
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the second MetaMask popup to appear
  const [metamaskPage2] = await Promise.all([
    browserContext.waitForEvent('page'), // Wait for the second popup to be created
  ]);

  await metamaskPage2.waitForLoadState();

  // Click "Confirm" button in MetaMask popup
  await metamaskPage2.click('button:has-text("Confirm")');

  // Wait for the "Waiting" element to become visible
  try {
    await page.waitForSelector('text="Waiting for the contract interaction approval"', { visible: true, timeout: 60000 });
    // Click on "Waiting" element if it appears
    await page.click('text="Waiting for the contract interaction approval"');
  } catch (error) {
    console.error('Waiting element not found within timeout.');
  }

  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the text "Successfully Purchased $Enrg" to be visible with an extended timeout
  try {
    await page.waitForSelector('text="Your task has been published and is now live!"', { visible: true, timeout: 120000 });
  } catch (error) {
    console.error('Successfully Purchased $Enrg element not found within timeout.');
  }

  // Click "Close" button
  await page.getByRole('button', { name: 'Done' }).click();

  // Add a delay to view the page after clicking the "Close" button
  await page.waitForTimeout(3000); // 3 seconds delay, adjust as needed

  console.log('Task created');

  // Click the task and verify using the title
  await page.waitForSelector(`text=${randomTitle}`, { timeout: 60000 });
  await page.click(`text=${randomTitle}`);
  console.log(`Verify the task created: ${randomTitle}`);

  // Verify the task using the title
  const taskTitle = await page.getByRole('heading', { name: randomTitle }).textContent();
  if (taskTitle === randomTitle) {
    console.log('Task verified successfully with the title: ' + taskTitle);
  } else {
    console.error('Task verification failed. Expected title: ' + randomTitle + ', but got: ' + taskTitle);
  }

  // Add a delay to view the page after clicking the "Close" button
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // await page.getByRole('row').locator('svg').first().click();

  // Click the 'Add Energy' button
  await page.getByRole('button', { name: 'Add Energy' }).click();
  
  // Retrieve the current value of 'Total $ENRG'
  const currentEnergyValue = await page.getByLabel('Total $ENRG').inputValue();
  const newEnergyValue = parseInt(currentEnergyValue) + 5;
  
  // Click the 'Total $ENRG' field and fill it with the new value
  await page.getByLabel('Total $ENRG').click();
  await page.getByLabel('Total $ENRG').fill(newEnergyValue.toString());
  await page.getByRole('button', { name: 'Perform Change' }).click();
  
  // Log the new value of 'Total $ENRG'
  console.log(`New Energy Value Set: ${newEnergyValue}`);
  
  // Wait for Metamask login popup to appear
  const [metamaskPage3] = await Promise.all([
      browserContext.waitForEvent('page'),
  ]);
  
  await metamaskPage3.waitForLoadState();
  
  // Ensure MetaMask popup is fully loaded
  await metamaskPage3.waitForSelector('button:has-text("Next")');
  
  // Click "Next" button in MetaMask popup
  await metamaskPage3.click('button:has-text("Next")');
  
  // Wait for "Approve" button to appear
  await metamaskPage3.waitForSelector('button:has-text("Approve")');
  
  // Click "Approve" button in MetaMask popup
  await metamaskPage3.click('button:has-text("Approve")');
  
  // Add a delay to allow MetaMask confirmation popup to appear
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed
  
  // Wait for the second MetaMask popup to appear
  const [metamaskPage4] = await Promise.all([
      browserContext.waitForEvent('page'), // Wait for the second popup to be created
  ]);
  
  await metamaskPage4.waitForLoadState();
  
  // Click "Confirm" button in MetaMask popup
  await metamaskPage4.click('button:has-text("Confirm")');
  
  // Wait for the "Waiting" element to become visible
  try {
      await page.waitForSelector('text="Waiting for Contract Approval"', { visible: true, timeout: 60000 });
      // Click on "Waiting" element if it appears
      await page.click('text="Waiting for Contract Approval"');
  } catch (error) {
      console.error('Waiting for Contract Approval element not found within timeout.');
  }
  
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed
  
  // Wait for the text "Successfully Purchased $Enrg" to be visible with an extended timeout
  try {
      await page.waitForSelector('text="Deposit Complete"', { visible: true, timeout: 120000 });
  } catch (error) {
      console.error('Deposit Complete element not found within timeout.');
  }
  
  // Click "Close" button
  await page.getByRole('button', { name: 'Close' }).click();

  // Close the browser
  await browserContext.close();

});

function generateRandomTitle1() {
  const titles = [
    'The Adventure Begins',
    'Mystery of the Lost City',
    'Journey to the Unknown',
    'Secrets of the Ancient World',
    'The Quest for the Golden Treasure',
    "Whispers of the Forgotten",
    "Echoes in the Mist",
    "The Secret Garden Gate",
    "Shadows of the Crescent Moon",
    "Lost in Time's Embrace",
    "Beneath the Starlit Sky",
    "Whispers of the Enchanted Forest",
    "Echoes from the Forgotten Realm",
    "The Hidden Pathway",
    "Chronicles of the Midnight Sun",
    "Mysteries of the Sapphire Isle",
    "Beyond the Horizon's Edge",
    "Songs of the Whispering Wind",
    "Legends of the Northern Lights",
    "The Enigma of Evermore",
    "Tales from the Emerald Vale",
    "Echoes of the Ancient Ruins",
    "Whispers of the Moonlit Meadow",
    "The Secret Chamber Mysteries",
    "Crimson Skies Over Avalon",
    "Whispers of the Lost City",
    "The Forgotten Kingdom Chronicles",
  ];
  const randomIndex = Math.floor(Math.random() * titles.length);
  return titles[randomIndex];
}

test('Task Completions', async () => {
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
  
    // await page.waitForLoadState('load');

    // Add a delay to ensure the popup is fully closed
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
      page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click()
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
    await page.waitForTimeout(2000); // 2 second delay, adjust as needed
  
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

// Wait for a while before logging out
await page.waitForTimeout(2000); // 2 seconds delay

// await page.pause();

// Highlighted modification
const fs = require('fs');

// Read the last input value from the file
let lastValue;
try {
  lastValue = parseInt(fs.readFileSync('lastValue.txt', 'utf8'), 10);
} catch (error) {
  // If the file doesn't exist or is empty, start with 0
  lastValue = 0;
}

// Determine the next value to use
let inputValue = lastValue + 1;
if (inputValue > 25) {
  inputValue = 1;
}

// Read the last number of completions from the file
let lastCompletionNumber;
try {
  lastCompletionNumber = parseInt(fs.readFileSync('lastCompletionNumber.txt', 'utf8'), 10);
} catch (error) {
  // If the file doesn't exist or is empty, start with 1
  lastCompletionNumber = 0;
}

// Determine the next number of completions to use
let completionNumber = lastCompletionNumber + 1;
if (completionNumber > 4) {
  completionNumber = 2;
}

// Create a new task
await page.getByRole('button', { name: 'Create Task' }).click();
console.log('Clicked on "Create Task" button');

await page.getByRole('menuitem', { name: 'New Task' }).click();
console.log('Selected "New Task" from the menu');

await page.getByPlaceholder('Enter title').click();
console.log('Clicked on title input field');

// Generate and fill a random title
const randomTitle = generateRandomTitle1();
await page.getByPlaceholder('Enter title').fill(randomTitle);
console.log(`Filled title input field with random title: ${randomTitle}`);

// Calculate the correct energy value based on the number of completions
const totalEnergy = inputValue * completionNumber;

// Fill the "Enter Energy" field with the current input value
await page.getByPlaceholder('Enter Energy').click();
await page.getByPlaceholder('Enter Energy').fill(inputValue.toString());
console.log(`Filled "Enter Energy" field with value: ${inputValue}`);

// Fill the "Enter number of completion" field with the current completion number
await page.getByRole('checkbox').click();
await page.getByPlaceholder('Enter number of completion').click();
await page.getByPlaceholder('Enter number of completion').fill(completionNumber.toString());
console.log(`Filled "Enter number of completion" field with value: ${completionNumber}`);

// Save the new input value and completion number to the files
fs.writeFileSync('lastValue.txt', inputValue.toString());
fs.writeFileSync('lastCompletionNumber.txt', completionNumber.toString());

// Verify the displayed total amount of energy
const totalEnergyString = totalEnergy.toFixed(2); // Assuming energy is displayed with two decimal places
await page.getByText(totalEnergyString).click();
console.log(`Verified total energy: ${totalEnergyString}`);

await page.getByLabel('Allow multiple completions').click();
console.log('Clicked on "Allow multiple completions" checkbox');

  // // Schedule Task with current date
  // await page.getByLabel('Schedule Task').click();

  // // Get the current date
  // const currentDate = new Date();
  // const day = currentDate.getDate();
  // const dayString = day.toString();

  // // Click the current date in the date picker
  // await page.getByRole('gridcell', { name: dayString }).click();

    await page.getByLabel('Qualification').click();
    console.log('Clicked on "Qualification"');

    await page.getByLabel('Public Qual', { exact: true }).click();
    console.log('Selected "Public Qual"');

    await page.locator('.tiptap').click();
    await page.locator('.tiptap').fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur vestibulum nisi at ultricies. Duis consequat nec quam eget feugiat. ');
    console.log('Filled the description field with placeholder text');

    await page.locator('label').filter({ hasText: 'Video References' }).getByRole('button').click();
    console.log('Clicked on "Video References" button');
    
    await page.locator('input[name="videoRefs\\.0\\.value"]').click();
    await page.locator('input[name="videoRefs\\.0\\.value"]').fill('https://www.youtube.com/watch?v=8oFEp-_iT98&t=2s');
    console.log('Filled first video reference input');

    await page.locator('input[name="videoRefs\\.1\\.value"]').click();
    await page.locator('input[name="videoRefs\\.1\\.value"]').fill('https://www.youtube.com/watch?v=8oFEp-_iT98&t=2s');
    console.log('Filled second video reference input');

    await page.locator('div').filter({ hasText: /^Video ReferencesVideo References$/ }).getByRole('button').nth(2).click();
    console.log('Clicked to add more video references');

    await page.locator('label').filter({ hasText: 'URL\'s' }).getByRole('button').click();
    console.log('Clicked on "URL\'s" button');

    await page.locator('input[name="links\\.0\\.value"]').click();
    await page.locator('input[name="links\\.0\\.value"]').fill('https://www.google.com/');
    console.log('Filled first URL input');

    await page.locator('input[name="links\\.1\\.value"]').click();
    await page.locator('input[name="links\\.1\\.value"]').fill('https://www.google.com/');
    console.log('Filled second URL input');

    await page.locator('div').filter({ hasText: /^URL'sURL's$/ }).getByRole('button').nth(2).click();
    console.log('Clicked to removed the URLs');

    await page.getByRole('button', { name: 'Save Task' }).click();
    console.log('Clicked on "Save Task" button');

    await page.getByRole('button', { name: 'Publish' }).click();
    console.log('Clicked on "Publish" button');

  // Wait for Metamask login popup to appear
  const [metamaskPage1] = await Promise.all([
    browserContext.waitForEvent('page'),
  ]);

  await metamaskPage1.waitForLoadState();

  // Ensure MetaMask popup is fully loaded
  await metamaskPage1.waitForSelector('button:has-text("Next")');

  // Click "Next" button in MetaMask popup
  await metamaskPage1.click('button:has-text("Next")');

  // Wait for "Approve" button to appear
  await metamaskPage1.waitForSelector('button:has-text("Approve")');

  // Click "Approve" button in MetaMask popup
  await metamaskPage1.click('button:has-text("Approve")');

  // Add a delay to allow MetaMask confirmation popup to appear
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the second MetaMask popup to appear
  const [metamaskPage2] = await Promise.all([
    browserContext.waitForEvent('page'), // Wait for the second popup to be created
  ]);

  await metamaskPage2.waitForLoadState();

  // Click "Confirm" button in MetaMask popup
  await metamaskPage2.click('button:has-text("Confirm")');

  // Wait for the "Waiting" element to become visible
  try {
    await page.waitForSelector('text="Waiting for the contract interaction approval"', { visible: true, timeout: 60000 });
    // Click on "Waiting" element if it appears
    await page.click('text="Waiting for the contract interaction approval"');
  } catch (error) {
    console.error('Waiting element not found within timeout.');
  }

  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the text "Successfully Purchased $Enrg" to be visible with an extended timeout
  try {
    await page.waitForSelector('text="Your task has been published and is now live!"', { visible: true, timeout: 120000 });
  } catch (error) {
    console.error('Successfully Purchased $Enrg element not found within timeout.');
  }

  // Click "Close" button
  await page.getByRole('button', { name: 'Done' }).click();

  // Add a delay to view the page after clicking the "Close" button
  await page.waitForTimeout(3000); // 5 seconds delay, adjust as needed

  console.log('Task with completions created');

    // Click the task and verify using the title
    await page.waitForSelector(`text=${randomTitle}`, { timeout: 60000 });
    await page.click(`text=${randomTitle}`);
    console.log(`Verify the task created: ${randomTitle}`);
  
    // Verify the task using the title
    const taskTitle = await page.getByRole('heading', { name: randomTitle }).textContent();
    if (taskTitle === randomTitle) {
      console.log('Task verified successfully with the title: ' + taskTitle);
    } else {
      console.error('Task verification failed. Expected title: ' + randomTitle + ', but got: ' + taskTitle);
    }
  
    // Add a delay to view the page after clicking the "Close" button
    await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed
  
    // await page.getByRole('row').locator('svg').first().click();

    // Click the 'Add Energy' button
    await page.getByRole('button', { name: 'Add Energy' }).click();
    
// Retrieve and verify the current value of 'Total $ENRG'
const previousEnergyValue = await page.getByLabel('Total $ENRG').inputValue();
console.log(`Previous $ENRG: ${previousEnergyValue}`);

const newEnergyValue = parseInt(previousEnergyValue) + 5;

// Fill the 'Total $ENRG' field with the new value
await page.getByLabel('Total $ENRG').click();
await page.getByLabel('Total $ENRG').fill(newEnergyValue.toString());

const enrgIncreasePerTask = await page.getByText('$ENRG Increase per task:').textContent();
console.log(`${enrgIncreasePerTask}`);

// Log the new value of 'Total $ENRG'
console.log(`New Energy Value Set: ${newEnergyValue}`);

const totalEnrgIncrease = await page.getByText('Total $ENRG Increase:').textContent();
console.log(`${totalEnrgIncrease}`);

// Verify the total energy for all completions
const totalEnrgForCompletions = await page.getByRole('textbox').inputValue();
console.log(`Total $ENRG for all completions: ${totalEnrgForCompletions}`);

await page.getByRole('button', { name: 'Perform Change' }).click();
    // Wait for Metamask login popup to appear
    const [metamaskPage3] = await Promise.all([
        browserContext.waitForEvent('page'),
    ]);
    
    await metamaskPage3.waitForLoadState();
    
    // Ensure MetaMask popup is fully loaded
    await metamaskPage3.waitForSelector('button:has-text("Next")');
    
    // Click "Next" button in MetaMask popup
    await metamaskPage3.click('button:has-text("Next")');
    
    // Wait for "Approve" button to appear
    await metamaskPage3.waitForSelector('button:has-text("Approve")');
    
    // Click "Approve" button in MetaMask popup
    await metamaskPage3.click('button:has-text("Approve")');
    
    // Add a delay to allow MetaMask confirmation popup to appear
    await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed
    
    // Wait for the second MetaMask popup to appear
    const [metamaskPage4] = await Promise.all([
        browserContext.waitForEvent('page'), // Wait for the second popup to be created
    ]);
    
    await metamaskPage4.waitForLoadState();
    
    // Click "Confirm" button in MetaMask popup
    await metamaskPage4.click('button:has-text("Confirm")');
    
    // Wait for the "Waiting" element to become visible
    try {
        await page.waitForSelector('text="Waiting for Contract Approval"', { visible: true, timeout: 60000 });
        // Click on "Waiting" element if it appears
        await page.click('text="Waiting for Contract Approval"');
    } catch (error) {
        console.error('Waiting for Contract Approval element not found within timeout.');
    }
    
    await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed
    
    // Wait for the text "Successfully Purchased $Enrg" to be visible with an extended timeout
    try {
        await page.waitForSelector('text="Deposit Complete"', { visible: true, timeout: 120000 });
    } catch (error) {
        console.error('Deposit Complete element not found within timeout.');
    }
    
    console.log('Successfully added energy for completions.');

    // Click "Close" button
    await page.getByRole('button', { name: 'Close' }).click();
    
    // Close the browser
    await browserContext.close();
});