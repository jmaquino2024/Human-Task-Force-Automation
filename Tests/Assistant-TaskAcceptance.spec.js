const { test, chromium } = require('@playwright/test');
const path = require('path');
const moment = require('moment');

test('Assistant - Task Acceptance', async () => {
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

    // await page.pause();

    async function processTask(page) {
        // Calculate today's date
        const todayDate = moment().format('MMMM D, YYYY'); // Adjust the format to match your application's date format
    
        // Click the "Active" button
        await page.locator('div').filter({ hasText: /^Active$/ }).getByRole('button').click();
        
        // Click "Decline" button up to 100 times with delay
        const maxAttempts = 100;
        let attempts = 0;
        const delayBetweenClicks = 2000; // 2000 ms delay (2 seconds)
    
        while (attempts < maxAttempts) {
            // Click "Decline" button
            await page.getByRole('button', { name: 'Decline' }).click();
            attempts++;
    
            // Add a delay between clicks to allow the page to update
            await page.waitForTimeout(delayBetweenClicks);
    
            // Check if the current date is present
            const dateLocator = page.locator('div').filter({ hasText: new RegExp(`^${todayDate}$`) }).first();
            if (await dateLocator.isVisible()) {
                await dateLocator.click();
                console.log('Clicked on the current date');
    
                // Verify the "Accept" button is visible and interactable
                const acceptButton = page.getByRole('button', { name: 'Accept' }).first();
                if (await acceptButton.isVisible() && await acceptButton.isEnabled()) {
                    await acceptButton.click();
                    console.log('Clicked "Accept" button');
    
                    // Click "Accept Task" button
                    await page.getByRole('button', { name: 'Accept Task' }).click();
                    console.log('Clicked "Accept Task" button');
                    break;
                } else {
                    console.error('Accept button is not visible or enabled.');
                }
            } else {
                // If no current date found, check for the "You have viewed all tasks" text
                try {
                    if (await page.getByText('You have viewed all tasks').isVisible()) {
                        await page.getByText('You have viewed all tasks').click();
                        await page.getByRole('button', { name: 'Return to Dashboard' }).click();
                        console.log('Clicked "Return to Dashboard" button');
                        await page.locator('div').filter({ hasText: /^Active$/ }).getByRole('button').click();
                        attempts = 0; // Reset attempts after returning to dashboard
                    }
                } catch (e) {
                    // If the text is not found, continue with the next iteration
                    console.log('No "You have viewed all tasks" message found.');
                }
            }
        }
    }
    
    // Usage
    await processTask(page);

    // Wait for the second MetaMask popup to appear
    const [metamaskPage2] = await Promise.all([
        browserContext.waitForEvent('page'), // Wait for the second popup to be created
    ]);

    await metamaskPage2.waitForLoadState();

    // Click "Confirm" button in MetaMask popup
    await metamaskPage2.click('button:has-text("Confirm")');

    // Wait for the "Waiting" element to become visible
    try {
        await page.waitForSelector('text="Waiting for Contract Interaction"', { visible: true, timeout: 60000 });
        // Click on "Waiting" element if it appears
        await page.click('text="Waiting for Contract Interaction"');
    } catch (error) {
        console.error('Waiting for Contract Interaction element not found within timeout.');
    }

    await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

    // Wait for the text "Successfully Purchased $Enrg" to be visible with an extended timeout
    try {
        await page.waitForSelector('text="Transaction Confirmed"', { visible: true, timeout: 120000 });
    } catch (error) {
        console.error('Transaction Confirmed element not found within timeout.');
    }

    // Click "Close" button
    await page.getByRole('button', { name: 'Return to Dashboard' }).click();

    // Add a delay to view the page after clicking the "Close" button
    await page.waitForTimeout(3000); // 3 seconds delay, adjust as needed

    console.log('Task Accepted');

        // Close the browser
        await browserContext.close();
});


test('Assistant - Task Completion', async () => {
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
    
    // await page.pause();

// Click the element with specified classes
await page.locator('td:nth-child(6)').first().click();
console.log('Clicked the task accepted');

// Click inside the editor
await page.locator('.tiptap').click();
console.log('Clicked inside the editor.');

// Fill the editor with 'Completed!'
await page.locator('.tiptap').fill('Completed!');
console.log('Filled the editor with "Completed!".');

// Open the 'Video References' section
await page.locator('label').filter({ hasText: 'Video References' }).getByRole('button').click();
console.log('Opened the "Video References" section.');

// Click the first button in 'Video References' section
await page.locator('div').filter({ hasText: /^Video ReferencesVideo References$/ }).getByRole('button').first().click();
console.log('Clicked the first button in "Video References" section.');

// Fill video reference inputs
await page.locator('input[name="videoRefs\\.2\\.value"]').click();
await page.locator('input[name="videoRefs\\.2\\.value"]').fill('https://www.youtube.com/watch?v=8oFEp-_iT98&t=2s');
console.log('Filled video reference 2.');

await page.locator('input[name="videoRefs\\.1\\.value"]').click();
await page.locator('input[name="videoRefs\\.1\\.value"]').fill('https://www.youtube.com/watch?v=8oFEp-_iT98&t=2s');
console.log('Filled video reference 1.');

await page.locator('input[name="videoRefs\\.0\\.value"]').click();
await page.locator('input[name="videoRefs\\.0\\.value"]').fill('https://www.youtube.com/watch?v=8oFEp-_iT98&t=2s');
console.log('Filled additional video reference.');

// Click to proceed in the video references section
await page.locator('div:nth-child(3) > .group > .inline-flex').click();
console.log('Proceeded in the video references section.');

// Click the third button in 'Video References' section
await page.locator('div').filter({ hasText: /^Video ReferencesVideo References$/ }).getByRole('button').nth(3).click();
console.log('Clicked the third button in "Video References" section.');

// Open the 'Links' section
await page.locator('label').filter({ hasText: 'Links' }).getByRole('button').click();
console.log('Opened the "Links" section.');

// Click the first button in 'Links' section
await page.locator('div').filter({ hasText: /^LinksLinks$/ }).getByRole('button').first().click();
console.log('Clicked the first button in "Links" section.');

// Fill link inputs
await page.locator('input[name="links\\.2\\.value"]').click();
await page.locator('input[name="links\\.2\\.value"]').fill('https://www.google.com/');
console.log('Filled link 2.');

await page.locator('input[name="links\\.1\\.value"]').click();
await page.locator('input[name="links\\.1\\.value"]').fill('https://www.google.com/');
console.log('Filled link 1.');

await page.locator('input[name="links\\.0\\.value"]').click();
await page.locator('input[name="links\\.0\\.value"]').fill('https://www.google.com/');
console.log('Filled additional link.');

// Click to proceed in the links section
await page.locator('div:nth-child(3) > .group > .inline-flex').click();
console.log('Proceeded in the links section.');

// Click the third button in 'Links' section
await page.locator('div').filter({ hasText: /^LinksLinks$/ }).getByRole('button').nth(3).click();
console.log('Clicked the third button in "Links" section.');

await page.getByRole('button', { name: 'Save' }).click();
console.log('Clicked the Save button');

// Switch to the 'Comments' tab
await page.getByRole('tab', { name: 'Comment' }).click();
console.log('Switched to the "Comments" tab.');

// Fill and send a comment
await page.locator('div').filter({ hasText: /^Send$/ }).locator('div').nth(1).click();
await page.locator('div').filter({ hasText: /^Send$/ }).locator('div').nth(1).fill('This is a test');
await page.getByRole('button', { name: 'Send' }).click();
console.log('Filled and sent a comment.');

// Switch back to the 'Task' tab
await page.getByRole('tab', { name: 'Task' }).click();
console.log('Switched back to the "Task" tab.');

// Submit the task for approval
await page.getByRole('button', { name: 'Submit for Approval' }).click();
await page.getByRole('button', { name: 'Close' }).click();
await page.getByRole('button').nth(1).click();
console.log('Submitted the task for approval.');

// // Click 'For Review' button
// await page.getByText('For Review').first().click();
// await page.getByText('For Review').first().click();
// console.log('Clicked on "Draft"');

// // Click the specified element again
// await page.locator('.rounded-xl.hover\\:bg-black\\/15.cursor-pointer.ease-in-out.duration-500.z-10').click();
// await page.locator('.rounded-xl.hover\\:bg-black\\/15.cursor-pointer.ease-in-out.duration-500.z-10').getByText('Review').click();
// console.log('Clicked the specified element again and selected "Review".');

// Close the browser
await browserContext.close();

});
