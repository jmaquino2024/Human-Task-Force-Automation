const { test, chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('Download Google Docs as PDF', async () => {
    const downloadPath = path.join(__dirname, 'downloads');

    // Create the download path directory if it does not exist
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
    }

    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized'] // Launch browser in maximized mode
    });

    const context = await browser.newContext({
        viewport: null, // Set to null to use the full screen size
        acceptDownloads: true, // Allow downloads
        downloadsPath: downloadPath // Set the download path
    });

    const page = await context.newPage();
    
    // Navigate to the Google Docs link
    await page.goto('https://docs.google.com/document/d/18yp5TJImbL03VF_phTQjVazJneBmDX_fOeOmvB9pZLk/edit');

    // Wait for the page to load
    await page.waitForTimeout(1000); // Increased timeout to ensure stability

    // // Pause the script for debugging
    // await page.pause();

    // Click on the "File" menu
    await page.getByRole('menuitem', { name: 'File' }).click();

    // Wait for the File menu to open
    await page.waitForTimeout(1000);

    // Click on the "Download" submenu
    await page.getByRole('menuitem', { name: 'Download' }).click();

    // Wait for the Download options to be visible
    await page.waitForTimeout(1000);

    // Trigger the PDF download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'PDF Document (.pdf)' }).click();
    const download = await downloadPromise;

    // Wait for the download to finish
    const downloadPathFile = path.join(downloadPath, download.suggestedFilename());
    await download.saveAs(downloadPathFile);

    // Check if the file exists
    if (fs.existsSync(downloadPathFile)) {
        console.log(`PDF File downloaded successfully: ${downloadPathFile}`);
    } else {
        console.error('PDF File download failed.');
    }

    // // Pause the script for debugging
    // await page.pause();

    // Close the browser
    await browser.close();
});

test('Download Google Docs as DOCX', async () => {
    const downloadPath = path.join(__dirname, 'downloads');

    // Create the download path directory if it does not exist
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
    }

    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });

    const context = await browser.newContext({
        viewport: null,
        acceptDownloads: true,
        downloadsPath: downloadPath
    });

    const page = await context.newPage();
    
    // Navigate to the Google Docs link
    await page.goto('https://docs.google.com/document/d/18yp5TJImbL03VF_phTQjVazJneBmDX_fOeOmvB9pZLk/edit');

    // Wait for the page to load
    await page.waitForTimeout(1000);

    // Click on the "File" menu
    await page.getByRole('menuitem', { name: 'File' }).click();

    // Wait for the File menu to open
    await page.waitForTimeout(1000);

    // Click on "Download"
    await page.getByRole('menuitem', { name: 'Download' }).click();

    // Wait for the Download options to be visible
    await page.waitForTimeout(1000);

    // Trigger the DOCX download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'Microsoft Word (.docx)' }).click();
    const download = await downloadPromise;

    // Save the downloaded file
    const downloadPathFile = path.join(downloadPath, download.suggestedFilename());
    await download.saveAs(downloadPathFile);

    // Check if the file exists
    if (fs.existsSync(downloadPathFile)) {
        console.log(`DOCX file downloaded successfully: ${downloadPathFile}`);
    } else {
        console.error('DOCX file download failed.');
    }

    await browser.close();
});