const { test, chromium } = require('@playwright/test');
const path = require('path');

test('Assistant - Profile update', async () => {
    const pathToExtension = path.join(__dirname, '../extensions/metamask');
    const userDataDir = '/tmp/test-user-data-dir';

    const browserContext = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`
        ],
        viewport: null
    });

    // Your test code here

    await browserContext.close();
});
