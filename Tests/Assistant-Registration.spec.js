const { test, chromium } = require('@playwright/test');
const path = require('path');

test('Assistant-Registration', async () => {
    const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '11.16.14_0');
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

    await page.pause();

    await page.getByRole('link', { name: 'Register here' }).click();
    await page.getByRole('link', { name: 'Looking to register instead' }).click();
    await page.getByRole('link', { name: 'Register as an Assistant' }).click();
    await page.getByRole('button', { name: 'Connect Wallet' }).click();
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

        // // Wait for the account selection screen to appear
        // await metamaskPage.waitForSelector('.mm-box.mm-checkbox.mm-text.mm-text--body-md.mm-box--display-inline-flex.mm-box--align-items-center.mm-box--color-text-default');

        // // Get all account checkboxes
        // const checkboxes = await metamaskPage.$$('.mm-box.mm-checkbox.mm-text.mm-text--body-md.mm-box--display-inline-flex.mm-box--align-items-center.mm-box--color-text-default');
    
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

});
