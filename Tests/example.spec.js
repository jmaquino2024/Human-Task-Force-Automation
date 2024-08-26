const { test, chromium } = require('@playwright/test');
const path = require('path');

async function retry(fn, retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Retry ${i + 1} failed, retrying in ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function performLogin(page, browserContext) {
  console.log('Starting login process...');
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Email / Password' }).click();
  await page.getByRole('link', { name: 'Login Using your Wallet' }).click();
  await page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click();

  const [metamaskPage] = await Promise.all([
    browserContext.waitForEvent('page'),
    page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click()
  ]);

  await metamaskPage.waitForLoadState();
  await metamaskPage.fill('input[type="password"]', 'M1cros-2024@@@');
  await metamaskPage.click('button:has-text("Unlock")');

  const checkboxes = await metamaskPage.$$('.mm-box.mm-checkbox.mm-text.mm-text--body-md.mm-box--display-inline-flex.mm-box--align-items-center.mm-box--color-text-default');

  if (checkboxes.length > 0) {
    await checkboxes[0].click();
  }
  if (checkboxes.length > 2) {
    await checkboxes[2].click();
  }

  await metamaskPage.click('button:has-text("Next")');
  await metamaskPage.click('button:has-text("Confirm")');

  await metamaskPage.waitForSelector('button:has-text("Confirm")', { state: 'detached' });
  await page.waitForTimeout(2000);

  page.setDefaultTimeout(10000);

  await page.getByRole('button', { name: 'Sign message' }).click();

  const [signMessagePage] = await Promise.all([
    browserContext.waitForEvent('page'),
    page.waitForSelector('button:has-text("Sign")')
  ]);

  await signMessagePage.waitForLoadState();
  await signMessagePage.click('button:has-text("Sign")');

  await page.waitForURL('https://develop.humandao.org/app', { timeout: 1800000 });

  console.log('Logged in successfully.');
}

test('Connecting Your Wallet', async () => {
  const pathToExtension = path.join('C:', 'Users', 'johnm', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', 'nkbihfbeogaeaoehlefnkodbefgpgknn', '11.16.16_2');
  const userDataDir = '/tmp/test-user-data-dir';

  const browserContext = await retry(async () => {
    console.log('Launching browser context...');
    return await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ],
      timeout: 300000 // Increased timeout to 5 minutes
    });
  }, 3);
  
  const pages = browserContext.pages();
  const page = pages.length > 0 ? pages[0] : await browserContext.newPage();

  await page.context().clearCookies();
  await page.context().clearPermissions();
  await page.goto('about:blank');

  await page.goto('https://develop.humandao.org/');
  await page.waitForTimeout(1000);
  await page.reload();

  await performLogin(page, browserContext);

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: '0xfB8....719' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  console.log('Logged out successfully.');

  await page.waitForLoadState('load');
  await new Promise(resolve => setTimeout(resolve, 3000));

  await browserContext.close();
});
