const { test, chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function setupMetaMaskExtension() {
  // Fetch the latest MetaMask version
  const latestVersion = execSync('curl -s https://api.github.com/repos/MetaMask/metamask-extension/releases/latest | grep "tag_name" | cut -d \'"\' -f 4').toString().trim();

  // Download MetaMask extension
  const metamaskZip = `metamask-chrome-${latestVersion}.zip`;
  execSync(`curl -L -o ${metamaskZip} https://github.com/MetaMask/metamask-extension/releases/download/${latestVersion}/metamask-chrome-${latestVersion}.zip`);

  // Unzip the MetaMask extension
  const unzipPath = path.join(__dirname, 'metamask-extension');
  execSync(`unzip -o ${metamaskZip} -d ${unzipPath}`);

  return unzipPath;
}

test('Connecting Your Wallet with MetaMask', async () => {
  const metaMaskPath = await setupMetaMaskExtension();
  const userDataDir = '/tmp/test-user-data-dir';

  // Launch browser with MetaMask extension
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${metaMaskPath}`,
      `--load-extension=${metaMaskPath}`
    ],
    viewport: null, // Fullscreen
  });

  // Continue with your original script logic here
  const pages = browserContext.pages();
  const page = pages.length > 0 ? pages[0] : await browserContext.newPage();

  // Your login logic
  await performLogin(page, browserContext);

  // Continue with your other logic (e.g., logout)
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: '0xfB8....719' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  console.log('Logged out successfully.');

  await page.waitForLoadState('load');
  await browserContext.close();
});
