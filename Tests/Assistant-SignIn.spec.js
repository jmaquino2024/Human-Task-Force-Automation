const { test, chromium } = require('@playwright/test');
const path = require('path');

test('Assistant - Profile update', async () => {
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

    // await page.pause();

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

    // // Click the first account checkbox
    // if (checkboxes.length > 0) {
    //     await checkboxes[0].click();
    //     console.log('Clicked on the first MetaMask account checkbox');
    // }

    // // Click the second account checkbox if it exists
    // if (checkboxes.length > 2) {
    //     await checkboxes[2].click();
    //     console.log('Clicked on the second MetaMask account checkbox');
    // }

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

        console.log('Logged in successfully.');
    
        // Wait for a while before performing additional interactions
        await page.waitForTimeout(2000); // 2 seconds delay
    
        await page.pause();

        await page.getByRole('button', { name: '0xB7F....986' }).click();

        await page.getByRole('button', { name: 'Log out' }).click();

        console.log('Logged out successfully.');

        await page.waitForLoadState('load');
       
         //  // Pause the script execution to inspect the final state
         //  await page.pause();


        // Wait for 30 seconds to ensure the changes are saved
        await page.waitForTimeout(5000);
       
        // Close the browser
        await browserContext.close();
       
});
       
    

