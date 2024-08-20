const { test, chromium } = require('@playwright/test');
const path = require('path');

test('Assistant - Dashboard Functionality', async () => {
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

        await page.getByRole('button', { name: 'Find Tasks' }).click();
        console.log('Successfully clicked the active "+" button.');
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay to allow tasks to load
        
        await page.getByRole('button').first().click();
        console.log('Task list displayed successfully.');
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
        
        await page.locator('div').filter({ hasText: /^Missions$/ }).getByRole('button').click();
        console.log('Successfully clicked the mission "+" button.');
        await new Promise(resolve => setTimeout(resolve, 8000)); // 8-second delay to ensure tasks are loaded
        
        await page.getByRole('button').first().click();
        console.log('Task list displayed successfully.');
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
        
        await page.getByText('For Review').first().click();
        await page.getByText('For Review').first().click();
        console.log('Successfully clicked the "Review" filter.');
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
        
        await page.locator('td:nth-child(4) > .inline-flex').first().click();
        console.log('Task under review is clickable.');
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
        
        await page.getByRole('button').nth(1).click();

        await page.getByRole('button', { name: 'Knowledge bits' }).click();
        const page1Promise = page.waitForEvent('popup');
        await page.getByRole('menuitem', { name: 'Ask Ally - AI Assisted help' }).click();
        const page1 = await page1Promise;
        await page1.getByRole('heading', { name: 'AI-assisted help desk for HTF' }).click();

        // Verify if the heading is present
        const isHeadingPresent0 = await page1.locator('role=heading', { name: 'AI-assisted help desk for HTF' }).count();
        if (isHeadingPresent0 > 0) {
            console.log('The "AI-assisted help desk for HTF" heading is present.');
        } else {
            console.error('Error: The "AI-assisted help desk for HTF" heading is not present.');
        }

        await page1.close();
        console.log('Closed "Ask Ally - AI Assisted help" page.');



        await page.getByRole('button', { name: 'Knowledge bits' }).click();
        const page2Promise = page.waitForEvent('popup');
        await page.getByRole('menuitem', { name: 'Where to buy $HDAO' }).click();
        const page2 = await page2Promise;
        await page2.getByRole('heading', { name: 'Get your $HDAO' }).click();

        // Verify if the heading is present
        const isHeadingPresent1 = await page2.locator('role=heading', { name: 'Get your $HDAO' }).count();
        if (isHeadingPresent1 > 0) {
            console.log('The "Get your $HDAO" heading is present.');
        } else {
            console.error('Error: The "Get your $HDAO" heading is not present.');
        }

        await page2.close();
        console.log('Closed "Where to buy $HDAO" page.');

        await page.getByRole('button', { name: 'Knowledge bits' }).click();
        const page3Promise = page.waitForEvent('popup');
        await page.getByRole('menuitem', { name: 'Learn Crypto/Web3' }).click();
        const page3 = await page3Promise;
        await page3.getByRole('heading', { name: 'Learning Modules' }).click();

        // Verify if the heading is present
        const isHeadingPresent2 = await page3.locator('role=heading', { name: 'Learning Modules' }).count();
        if (isHeadingPresent2 > 0) {
            console.log('The "Learning Modules" heading is present.');
        } else {
            console.error('Error: The "Learning Modules" heading is not present.');
        }

        await page3.close();
        console.log('Closed "Learn Crypto/Web3" page.');

    await page.locator('header').getByRole('button').first().click();
    console.log('Clicked on the first notification button');

  await page.getByRole('button', { name: 'View More' }).click();
  console.log('Clicked "View More"');
  await page.click('text=See Task Pool');
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay to allow tasks to load
  await page.click('button:has(svg.lucide-x)');

  const page4Promise = page.waitForEvent('popup');
  await page.getByText('Learn Crypto/Web3').click();
  const page4 = await page4Promise;
  console.log('Clicked "Learn Crypto/Web3" link.');

  // Add a delay to view the page before checking for the link
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed

  // Verify if the "humanDAO Academy" link is present
  const isLinkPresent = await page4.locator('role=link', { name: 'humanDAO Academy' }).count();
      if (isLinkPresent > 0) {
        console.log('The "humanDAO Academy" link is available on the new page.');
      } else {
        console.error('Error: The "humanDAO Academy" link is not available on the new page.');
      }

  // Close the new page
  await page4.close();
  console.log('Closed "Learn Crypto/Web3" page.');

  const page5Promise = page.waitForEvent('popup');
  await page.getByText('Get $HDAO').click();
  const page5 = await page5Promise;
  console.log('Clicked "Get $HDAO" link.');

  // Wait for the new page to load
  await page5.waitForLoadState('load');
  console.log('Loaded "Get $HDAO" page.');

  // Add a delay to view the page before checking for the link
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed

  // Verify if the "logo HDAO" link is present
  const isLogoLinkPresent = await page5.locator('role=link', { name: 'logo HDAO' }).count();
      if (isLogoLinkPresent > 0) {
        console.log('The "logo HDAO" link is available on the new page.');
      } else {
        console.error('Error: The "logo HDAO" link is not available on the new page.');
      }

  // Close the new page
  await page5.close();
  console.log('Closed "Get $HDAO" page.');

  const page6Promise = page.waitForEvent('popup');
  await page.locator('a').filter({ hasText: 'Ask Ally - AI Assisted help' }).click();
  const page6 = await page6Promise;
  console.log('Clicked "Ask Ally - AI Assisted help" link.');

  // Wait for the new page to load
  await page6.waitForLoadState('load');
  console.log('Loaded "Ask Ally - AI Assisted help" page.');

  // Add a delay to view the page before checking for the heading
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed

  // Verify if the heading "AI-assisted help desk for HTF" is present
  const isHeadingPresent = await page6.locator('role=heading', { name: 'AI-assisted help desk for HTF' }).count();
      if (isHeadingPresent > 0) {
        console.log('The heading "AI-assisted help desk for HTF" is available on the new page.');
      } else {
        console.error('Error: The heading "AI-assisted help desk for HTF" is not available on the new page.');
      }

  // Close the new page
  await page6.close();
  console.log('Closed "Ask Ally - AI Assisted help" page.');

  console.log('Test completed.');
  // Close the browser context
  await browserContext.close();

});
       
    

