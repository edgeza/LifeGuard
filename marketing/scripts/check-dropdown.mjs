import { chromium } from 'playwright-core';
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox']
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:3010/');
await p.waitForTimeout(500);

// Click the Product dropdown
await p.click('button:has-text("Product")');
await p.waitForTimeout(400);
await p.screenshot({ path: 'C:/Users/juan/AppData/Local/Temp/lifeguard-screens/21-product-dropdown.png' });
console.log('saved 21-product-dropdown.png');
await browser.close();