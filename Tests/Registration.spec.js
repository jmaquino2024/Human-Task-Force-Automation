const { test, chromium } = require('@playwright/test');
const path = require('path');

// List of unique codes
const uniqueCodes = [
  '274B1409-9890-47CE-B9EC-52919DB73489',
  '93C9E14A-53A7-4656-AB0F-7802695E1BD7',
  '9BD25D76-CA62-4FAD-B275-9E98C66E13CB',
  '8B585B8F-85AA-4019-9C99-D14E2F73BC8B',
  '16F5241E-B2DF-4745-809F-FC724A959F9D',
  'E399DBD2-61FD-4181-BC6E-557118CB01BE',
  'E29ACD60-E0A1-428A-9BC8-C54F268A117E',
  '2E830A6E-D825-4363-93C1-B5B71012DA6D',
  '7A93DDD7-6F8D-4E25-A295-6F84D4B64B19',
  'F0B0EF59-B4F2-41CB-A471-265C1B7AB726',
  '45BCC65C-B507-4599-A059-6C359D0E8718',
  '330DE361-01A9-488D-9E74-12E1EE669B46',
  '7D5B52CB-CB03-495D-A1F3-B29969032538',
  'DBDC1352-C37E-4834-84DA-045E0C7E32D3',
  '76DC2EC5-7D97-4B38-90D9-E06EA00A5392'
];

// Function to get a unique code
function getUniqueCode(codes) {
  if (codes.length === 0) {
    throw new Error('No more unique codes available');
  }
  const randomIndex = Math.floor(Math.random() * codes.length);
  const code = codes[randomIndex];
  codes.splice(randomIndex, 1); // Remove the code from the array
  return code;
}

test('Dashboard Functionality', async () => {
  const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '11.16.14_0');
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

  await page.pause();

  await page.getByRole('link', { name: 'Don\'t have an account?' }).click();
  await page.getByRole('link', { name: 'Create Account' }).click();
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

  // Ensure MetaMask popup is fully loaded
  await metamaskPage.waitForSelector('button:has-text("Next")');

  // Click "Next" button in MetaMask popup
  await metamaskPage.click('button:has-text("Next")');

  // Click "Confirm" button in MetaMask popup
  await metamaskPage.click('button:has-text("Confirm")');

  await page.getByPlaceholder('Enter your email address').click();
  await page.getByPlaceholder('Enter your email address').fill('john.marvin.a.aquino71@gmail.com');

  // Use the function to get a unique code
  const uniqueCode = getUniqueCode(uniqueCodes);

  await page.getByPlaceholder('Enter your code').click();
  await page.getByPlaceholder('Enter your code').fill(uniqueCode);
  console.log(`Entered unique code: ${uniqueCode}`);

  await page.getByRole('button', { name: 'Create Account' }).click();

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

  // Wait for 5 seconds to ensure the changes are saved
  await page.waitForTimeout(5000);
  
});
