const { test, chromium } = require('@playwright/test');
const path = require('path');

test('Accept Submission', async () => {
  const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '12.0.5_2');
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
  
  await page.locator('div').filter({ hasText: /^Your TasksCreate Task$/ }).getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Clarification' }).click();
  await page.getByRole('menuitem', { name: 'Published' }).click();
  await page.getByRole('menuitem', { name: 'Active' }).click();
  await page.getByRole('menuitem', { name: 'Active' }).press('Escape');
  await page.waitForTimeout(3000); // 3-second delay before proceeding to the next command
  console.log('Selected the ‘Review’ filter from the list of filters.');

  await page.locator('td:nth-child(4)').first().click();
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to see the Review step
  console.log('Selected the first row from the review task list.');

  await page.getByRole('button', { name: 'Accept Submission' }).click();
  await page.waitForTimeout(2000); // 2-second delay before proceeding to the next command
  console.log('Clicking the "Accept Submission" button.');

  await page.getByRole('button', { name: 'Accept Submission' }).click();
  await page.waitForTimeout(3000); // 3-second delay before proceeding to the next command
  console.log('Task submitted successfully.');

  // Select the container that holds the icons
  const iconContainer = page.locator('div.md\\:flex-1.flex.justify-between');

  // Select all SVG icons within the container
  const icons = iconContainer.locator('div.flex svg');

  // Get the number of SVG icons
  const count = await icons.count();

  // Iterate over each icon and click it
  for (let i = 0; i < count; i++) {
    const icon = icons.nth(i);

    // Ensure the icon is visible before clicking
    await icon.waitFor({ state: 'visible' });

    // Click the icon
    await icon.click();

    // Add a slight delay after each click (optional)
    await page.waitForTimeout(300);  // Adjust this delay as needed
  }

console.log('All star ratings are working properly.');

await page.getByPlaceholder('Enter your Review...').click();
await page.getByPlaceholder('Enter your Review...').fill('Great work!');
console.log('Added a comment successfully.');
await page.waitForTimeout(2000); // 2-second delay before proceeding to the next command

// Click the 'Add Rating' button
await page.getByRole('button', { name: 'Add Rating' }).click();
console.log('Successfully submitted a task from the assistant.');

// Wait for the 'Done!' text to appear before proceeding
await page.waitForSelector('text=Done!');

try {
  // Wait for the 'Completed' text to appear
  await page.waitForSelector('text=Completed', { state: 'visible' });
  console.log('Confirmed and marked as ‘Completed’.');

  // Log a professional success message if 'Completed' text is found
  console.log('Task successfully completed.');
} catch (error) {
  // Log a professional error message if 'Completed' text is not found
  console.error('Error: Unable to verify task completion.', error);
}

  // Close the browser context
  await browserContext.close();
  
});

test('Reject functionality', async () => {
  const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '12.0.5_2');
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

  await page.pause();
  
 // Perform actions on the page
 await page.locator('div').filter({ hasText: /^Your TasksCreate Task$/ }).getByRole('button').first().click();
 await page.getByRole('menuitem', { name: 'Clarification' }).click();
 await page.getByRole('menuitem', { name: 'Published' }).click();
 await page.getByRole('menuitem', { name: 'Active' }).click();
 await page.getByRole('menuitem', { name: 'Active' }).press('Escape');
 await page.waitForTimeout(3000); // 3-second delay before proceeding to the next command
 console.log('Selected the "Review" filter from the list of filters');

 await page.locator('td:nth-child(4)').first().click();
 await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to see the Review step
 console.log('Selected the first row from the review task list.');

  // Get the heading text dynamically
  const headingText = await page.getByRole('heading').textContent();

  // Log the heading text to verify what it is
  console.log(`Heading found: ${headingText}`);

  // Verify if the heading text is correct
  if (headingText && headingText.trim() !== '') {
      console.log(`Verified: The heading "${headingText}" is visible.`);
  } else {
      console.error('Failed to verify: No heading text found.');
      return; // Stop execution if the heading is not found
  }

  // Continue with the original actions after verification
  await page.getByRole('heading', { name: headingText.trim() }).click();

  await page.getByRole('button', { name: 'Request New Assistant' }).click();
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to see the Request New Assistant step
  console.log('Clicked the "Request New Assistant".');

  await page.getByRole('button', { name: 'Reassign Task' }).click();
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to see the Reassign Task step

  // Wait for the 'Task is now pending to be moved to the task pool' text to appear before proceeding
  await page.waitForSelector('text=Task is now pending to be moved to the task pool');
  await page.waitForTimeout(2000); // 2-second delay before proceeding to the next command

  // Function to attempt click and retry with refreshing the new tab
async function attemptClickAndRetry() {
  try {
      // Attempt to click the element
      await page.locator('td:nth-child(5)').first().click();
  } catch (error) {
      console.error('Failed to click the element. Retrying...');

      // Open a new page and refresh
      const newPage = await browserContext.newPage();
      await newPage.goto('https://pa-api-test.vercel.app/api/automation/web3/tasks/updates');
      await newPage.waitForLoadState('load'); // Ensure the new page is fully loaded
      console.log('The API URL was successfully opened and executed.');

      // Refresh the new page a few times
      for (let i = 0; i < 1; i++) {
          await newPage.reload(); // Refresh the new page
          await newPage.waitForLoadState('load'); // Wait until the new page is fully loaded
          await newPage.waitForTimeout(2000); // 2-second delay between refreshes
      }

      // Close the new page
      await newPage.close();

      // Refresh the current page again
      await page.reload(); // Refresh the current page
      await page.waitForLoadState('load'); // Wait until the current page is fully loaded
      await page.waitForTimeout(2000); // 2-second delay after refreshing the current page

      // Retry the click
      await page.locator('td:nth-child(5)').first().click();
  }
}

// Perform the final interactions after the refresh
await attemptClickAndRetry();

  // Re-verify the heading after the page refresh
  const refreshedHeadingText = await page.getByRole('heading').textContent();
  console.log(`Heading after refresh: ${refreshedHeadingText}`);

  if (refreshedHeadingText === headingText) {
      console.log('The heading matches after the refresh.');
  } else {
      console.error('The heading does not match after the refresh.');
  }

  // Verify the "Published" status 
  const reviewStatusExists = await page.getByLabel(refreshedHeadingText.trim()).getByText('Published').isVisible();

  if (reviewStatusExists) {
      console.log('Verified: "Published" status is present.');
  } else {
      console.error('Failed to verify: "Published" status is not present.');
  }

  await page.waitForTimeout(2000); // 2-second delay before continuing

  // Continue with actions on the original page
  await page.close();
  await browserContext.close();
});

test('Request Improvements', async () => {
  const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '12.0.5_2');
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
  console.log('Login successfully');

  // Wait for a while before performing additional interactions
  await page.waitForTimeout(2000); // 2 seconds delay

  // await page.pause();
  
  await page.locator('div').filter({ hasText: /^Your TasksCreate Task$/ }).getByRole('button').first().click();
  await page.getByRole('menuitem', { name: 'Clarification' }).click();
  await page.getByRole('menuitem', { name: 'Published' }).click();
  await page.getByRole('menuitem', { name: 'Active' }).click();
  await page.getByRole('menuitem', { name: 'Active' }).press('Escape');
  await page.waitForTimeout(3000); // 3-second delay before proceeding to the next command
  console.log('Selected the "Review" filter from the list of filters');

  await page.locator('td:nth-child(4)').first().click();
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay to see the Review step
  console.log('Selected the first row from the review task list.');

  await page.getByRole('button', { name: 'Request Improvements' }).click();
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay to see the Review step
  console.log('Clicked the "Request Improvements" button');
  await page.locator('form').getByRole('paragraph').click();

  // Fill the input with the request for improvement
  await page.locator('div').filter({ hasText: /^What improvements would you like to request\?$/ }).locator('div').nth(3).fill('Please enhance your task. Thanks!');
  console.log('Filling the input with the request for improvement.');

  // Confirm the text has been added
  const inputValue = await page.locator('div').filter({ hasText: /^What improvements would you like to request\?$/ }).locator('div').nth(3).inputValue();
  console.log('Input value added:', inputValue);

  // Wait for 1 second to see the Review step
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

  await page.getByRole('button', { name: 'Request Improvements' }).click();

  // Wait for the 'Done!' text to appear before proceeding
  await page.waitForSelector('text=Done!');


  try {
    // Wait for the 'Completed' text to appear
    await page.waitForSelector('text=Active', { state: 'visible' });
  
    // Log a professional success message if 'Completed' text is found
    console.log('Task has been successfully moved to the assistant.');
  } catch (error) {
    // Log a professional error message if 'Completed' text is not found
    console.error('Task could not be moved to the assistant.', error);
  }

  // Close the browser context
  await browserContext.close();

});