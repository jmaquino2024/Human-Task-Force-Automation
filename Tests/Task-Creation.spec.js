const { test, chromium } = require('@playwright/test');
const path = require('path');

function generateRandomTitle() {
  const titles = [
    'The Adventure Begins',
    'Mystery of the Lost City',
    'Journey to the Unknown',
    'Secrets of the Ancient World',
    'The Quest for the Golden Treasure',
    "Whispers of the Forgotten",
    "Echoes in the Mist",
    "The Secret Garden Gate",
    "Shadows of the Crescent Moon",
    "Lost in Time's Embrace",
    "Beneath the Starlit Sky",
    "Whispers of the Enchanted Forest",
    "Echoes from the Forgotten Realm",
    "The Hidden Pathway",
    "Chronicles of the Midnight Sun",
    "Mysteries of the Sapphire Isle",
    "Beyond the Horizon's Edge",
    "Songs of the Whispering Wind",
    "Legends of the Northern Lights",
    "The Enigma of Evermore",
    "Tales from the Emerald Vale",
    "Echoes of the Ancient Ruins",
    "Whispers of the Moonlit Meadow",
    "The Secret Chamber Mysteries",
    "Crimson Skies Over Avalon",
    "Whispers of the Lost City",
    "The Forgotten Kingdom Chronicles",
  ];
  const randomIndex = Math.floor(Math.random() * titles.length);
  return titles[randomIndex];
}

test('Task Creation', async () => {
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

  // Perform the login steps
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Email / Password' }).click();
  await page.getByRole('link', { name: 'Login Using your Wallet' }).click();
  await page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click();

  // Wait for Metamask login popup to appear
  const [metamaskPage] = await Promise.all([
    browserContext.waitForEvent('page'),
    page.getByRole('button', { name: 'Metamask Metamask Connect to' }).click()
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
  await page.waitForURL('https://develop.humandao.org/app', { timeout: 60000 });

  // Wait for a while before logging out
  await page.waitForTimeout(2000); // 2 seconds delay

  await page.pause();

  // Highlighted modification
  const fs = require('fs');

  // Read the last input value from the file
  let lastValue;
  try {
    lastValue = parseInt(fs.readFileSync('lastValue.txt', 'utf8'), 10);
  } catch (error) {
    // If the file doesn't exist or is empty, start with 0
    lastValue = 0;
  }

  // Determine the next value to use
  let inputValue = lastValue + 1;
  if (inputValue > 25) {
    inputValue = 1;
  }

  // Create a new task
  await page.getByRole('button', { name: 'Create Task' }).click();
  console.log('Clicked on "Create Task" button');

  await page.getByRole('menuitem', { name: 'New Task' }).click();
  console.log('Selected "New Task" from the menu');

  await page.getByPlaceholder('Enter title').click();
  console.log('Clicked on title input field');

  // Generate and fill a random title
  const randomTitle = generateRandomTitle();
  await page.getByPlaceholder('Enter title').fill(randomTitle);
  console.log(`Filled title input field with random title: ${randomTitle}`);

  // Fill the "Enter Energy" field with the current input value
  await page.getByPlaceholder('Enter Energy').click();
  await page.getByPlaceholder('Enter Energy').fill(inputValue.toString());
  console.log(`Filled "Enter Energy" field with value: ${inputValue}`);

  // Save the new input value to the file
  fs.writeFileSync('lastValue.txt', inputValue.toString());

  // // Schedule Task with current date
  // await page.getByLabel('Schedule Task').click();

  // // Get the current date
  // const currentDate = new Date();
  // const day = currentDate.getDate();
  // const dayString = day.toString();

  // // Click the current date in the date picker
  // await page.getByRole('gridcell', { name: dayString }).click();

  await page.getByLabel('Qualification').click();
  console.log('Clicked on "Qualification"');

  await page.getByLabel('Public Qual', { exact: true }).click();
  console.log('Selected "Public Qual"');

  await page.locator('.tiptap').click();
  await page.locator('.tiptap').fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur vestibulum nisi at ultricies. Duis consequat nec quam eget feugiat.');
  console.log('Filled the description field with placeholder text');

  await page.locator('label').filter({ hasText: 'Video References' }).getByRole('button').click();
  console.log('Clicked on "Video References" button');

  await page.locator('input[name="videoRefs\\.0\\.value"]').click();
  await page.locator('input[name="videoRefs\\.0\\.value"]').fill('https://www.youtube.com/watch?v=8oFEp-_iT98&t=2s');
  console.log('Filled first video reference input');

  await page.locator('input[name="videoRefs\\.1\\.value"]').click();
  await page.locator('input[name="videoRefs\\.1\\.value"]').fill('https://www.youtube.com/watch?v=8oFEp-_iT98&t=2s');
  console.log('Filled second video reference input');

  await page.locator('div').filter({ hasText: /^Video ReferencesVideo References$/ }).getByRole('button').nth(2).click();
  console.log('Clicked to removed the video references');

  await page.locator('label').filter({ hasText: 'URL\'s' }).getByRole('button').click();
  console.log('Clicked on "URL\'s" button');

  await page.locator('input[name="links\\.0\\.value"]').click();
  await page.locator('input[name="links\\.0\\.value"]').fill('https://www.google.com/');
  console.log('Filled first URL input');

  await page.locator('input[name="links\\.1\\.value"]').click();
  await page.locator('input[name="links\\.1\\.value"]').fill('https://www.google.com/');
  console.log('Filled second URL input');

  await page.locator('div').filter({ hasText: /^URL'sURL's$/ }).getByRole('button').nth(2).click();
  console.log('Clicked to removed the URLs');

  await page.getByRole('button', { name: 'Save Task' }).click();
  console.log('Clicked on "Save Task" button');

  await page.getByRole('button', { name: 'Publish' }).click();
  console.log('Clicked on "Publish" button');

  // Wait for Metamask login popup to appear
  const [metamaskPage1] = await Promise.all([
    browserContext.waitForEvent('page'),
  ]);

  await metamaskPage1.waitForLoadState();

  // Ensure MetaMask popup is fully loaded
  await metamaskPage1.waitForSelector('button:has-text("Next")');

  // Click "Next" button in MetaMask popup
  await metamaskPage1.click('button:has-text("Next")');

  // Wait for "Approve" button to appear
  await metamaskPage1.waitForSelector('button:has-text("Approve")');

  // Click "Approve" button in MetaMask popup
  await metamaskPage1.click('button:has-text("Approve")');

  // Add a delay to allow MetaMask confirmation popup to appear
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the second MetaMask popup to appear
  const [metamaskPage2] = await Promise.all([
    browserContext.waitForEvent('page'), // Wait for the second popup to be created
  ]);

  await metamaskPage2.waitForLoadState();

  // Click "Confirm" button in MetaMask popup
  await metamaskPage2.click('button:has-text("Confirm")');

  // Wait for the "Waiting" element to become visible
  try {
    await page.waitForSelector('text="Waiting for the contract interaction approval"', { visible: true, timeout: 60000 });
    // Click on "Waiting" element if it appears
    await page.click('text="Waiting for the contract interaction approval"');
  } catch (error) {
    console.error('Waiting element not found within timeout.');
  }

  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // Wait for the text "Successfully Purchased $Enrg" to be visible with an extended timeout
  try {
    await page.waitForSelector('text="Your task has been published and is now live!"', { visible: true, timeout: 120000 });
  } catch (error) {
    console.error('Successfully Purchased $Enrg element not found within timeout.');
  }

  // Click "Close" button
  await page.getByRole('button', { name: 'Done' }).click();

  // Add a delay to view the page after clicking the "Close" button
  await page.waitForTimeout(3000); // 3 seconds delay, adjust as needed

  console.log('Task created');

  // Click the task and verify using the title
  await page.waitForSelector(`text=${randomTitle}`, { timeout: 60000 });
  await page.click(`text=${randomTitle}`);
  console.log(`Verify the task created: ${randomTitle}`);

  // Verify the task using the title
  const taskTitle = await page.getByRole('heading', { name: randomTitle }).textContent();
  if (taskTitle === randomTitle) {
    console.log('Task verified successfully with the title: ' + taskTitle);
  } else {
    console.error('Task verification failed. Expected title: ' + randomTitle + ', but got: ' + taskTitle);
  }

  // Add a delay to view the page after clicking the "Close" button
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed

  // await page.getByRole('row').locator('svg').first().click();

  // Click the 'Add Energy' button
  await page.getByRole('button', { name: 'Add Energy' }).click();
  
  // Retrieve the current value of 'Total $ENRG'
  const currentEnergyValue = await page.getByLabel('Total $ENRG').inputValue();
  const newEnergyValue = parseInt(currentEnergyValue) + 5;
  
  // Click the 'Total $ENRG' field and fill it with the new value
  await page.getByLabel('Total $ENRG').click();
  await page.getByLabel('Total $ENRG').fill(newEnergyValue.toString());
  await page.getByRole('button', { name: 'Perform Change' }).click();
  
  // Log the new value of 'Total $ENRG'
  console.log(`New Energy Value Set: ${newEnergyValue}`);
  
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
  
  // Wait for the second MetaMask popup to appear
  const [metamaskPage4] = await Promise.all([
      browserContext.waitForEvent('page'), // Wait for the second popup to be created
  ]);
  
  await metamaskPage4.waitForLoadState();
  
  // Click "Confirm" button in MetaMask popup
  await metamaskPage4.click('button:has-text("Confirm")');
  
  // Wait for the "Waiting" element to become visible
  try {
      await page.waitForSelector('text="Waiting for Contract Approval"', { visible: true, timeout: 60000 });
      // Click on "Waiting" element if it appears
      await page.click('text="Waiting for Contract Approval"');
  } catch (error) {
      console.error('Waiting for Contract Approval element not found within timeout.');
  }
  
  await page.waitForTimeout(5000); // 5 seconds delay, adjust as needed
  
  // Wait for the text "Successfully Purchased $Enrg" to be visible with an extended timeout
  try {
      await page.waitForSelector('text="Deposit Complete"', { visible: true, timeout: 120000 });
  } catch (error) {
      console.error('Deposit Complete element not found within timeout.');
  }
  
  // Click "Close" button
  await page.getByRole('button', { name: 'Close' }).click();

  // Close the browser
  await browserContext.close();

});
