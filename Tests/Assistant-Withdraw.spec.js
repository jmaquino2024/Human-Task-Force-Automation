const { test, chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs'); // Ensure fs is imported

test('Assistant - Assets-Withdraw', async () => {
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

//     // Click the first account checkbox
//     if (checkboxes.length > 0) {
//       await checkboxes[0].click();
//   }

//     // Click the second account checkbox if it exists
//     if (checkboxes.length > 2) {
//     await checkboxes[2].click();
//   }

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

    await page.getByRole('button', { name: '0xB7F....986' }).click();
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
    if (inputValue > 16) {
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
  const [metamaskPage0] = await Promise.all([
    browserContext.waitForEvent('page'),
  ]);

  await metamaskPage0.waitForLoadState();

  // Ensure MetaMask popup is fully loaded
  await metamaskPage0.waitForSelector('button:has-text("Next")');

  // Click "Next" button in MetaMask popup
  await metamaskPage0.click('button:has-text("Next")');

  // Wait for "Approve" button to appear
  await metamaskPage0.waitForSelector('button:has-text("Approve")');

  // Click "Approve" button in MetaMask popup
  await metamaskPage0.click('button:has-text("Approve")');

  // Add a delay to allow MetaMask confirmation popup to appear
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

    
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
if (inputValue > 16) {
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

// Wait for Metamask login popup to appear
const [metamaskPage4] = await Promise.all([
    browserContext.waitForEvent('page'),
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