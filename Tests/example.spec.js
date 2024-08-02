const { test, chromium } = require('@playwright/test');
const path = require('path');
const moment = require('moment');

test.only('Assistant - Task Acceptance', async () => {
    const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '11.16.16_2');
    const userDataDir = '/tmp/test-user-data-dir';

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

    // Navigate to MetaMask connection confirmation
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

    // Wait for a while before performing additional interactions
    await page.waitForTimeout(2000); // 2 seconds delay

    await page.pause();

    await page.getByRole('row').locator('svg').first().click();

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
