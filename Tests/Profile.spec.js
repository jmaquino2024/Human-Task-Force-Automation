const { test, chromium } = require('@playwright/test');
const path = require('path');

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
  
    await page.pause();
  
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
