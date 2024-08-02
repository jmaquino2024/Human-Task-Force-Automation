const { test, chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs'); // Ensure fs is imported

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
