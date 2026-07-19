import { chromium } from 'playwright-core';
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox']
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 800 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:3010/');
await p.waitForTimeout(500);

const hamburger = p.locator('button[aria-label="Open menu"]').first();
const cls = await hamburger.getAttribute('class');
const computed = await hamburger.evaluate(el => {
  const s = getComputedStyle(el);
  return { display: s.display, visibility: s.visibility, opacity: s.opacity, width: s.width };
});
console.log('class:', cls);
console.log('computed:', computed);
await browser.close();